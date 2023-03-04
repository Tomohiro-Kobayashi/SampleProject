// ===============
// メソッド類
// ===============
import Point from "./point";
import { useEffect, useRef } from "react";

// 正規化
export const normalize = (_p, size) => {
  const x = _p.x / size.base;
  const y = _p.y / size.base;

  return new Point(x, y);
};

// 座標返す
export const clientPosision = (e, size, isNormalize= true) => {
  let points = []; //配列で返す
  if (!e.touches) {
    // マウス座標＆タッチ一本
    const rect = e.currentTarget.getBoundingClientRect();
    const p = new Point(~~(e.clientX - rect.left), ~~(e.clientY - rect.top));
    const np = normalize(p, size);
    points[0] = isNormalize ? np : p;
  } else {
    //@ts-ignore ジェスチャー座標
    points = Object.entries(e.touches).map(([i, v]) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const p = new Point(
        ~~(v.clientX - rect.left || 0),
        ~~(v.clientY - rect.top || 0)
      );
      const np = normalize(p, size);
      return isNormalize ? np : p;
    });
  }
  return points;
};

// ジェスチャーからスケール値
export const updateScale = (currentPoints, startPoints, tempScale) => {
  const startDistance = Point.distance(startPoints[0], startPoints[1]);
  const currentDistance = Point.distance(currentPoints[0], currentPoints[1]);
  let scale = (currentDistance / startDistance) * tempScale;
  scale = Number.isNaN(scale) ? 1.0 : scale;
  scale = Math.max(scale, 1.0);
  scale = Math.min(scale, 3.0);
  return scale;
};

// 2点間の中心を原点とした原点とt1(t2でも問題ない)との角度
export const touchDeg = (touchPoint) => {
  const t1 = touchPoint[0];
  const t2 = touchPoint[1];
  const origin = Point.interpolate(t1, t2, 0.5);
  const angle = (Math.atan2(origin.y - t1.y, origin.x - t1.x) * 180) / Math.PI;
  return angle;
};

// 現在角度と回転値から反映する
export const updateRotate = (currentPoints, tempDeg, tempRotate) => {
  const currentDeg = touchDeg(currentPoints);
  const diffDeg = currentDeg - tempDeg;
  const rotate = tempRotate + diffDeg;
  return rotate;
};

// tick処理
export const useAnimationFrame = (cb, deps) => {

  //   const frame = useRef<ReturnType<typeof requestAnimationFrame>>();
  const frame = useRef();
  const last = useRef(performance.now());
  const init = useRef(performance.now());

  const animate = () => {
    const now = performance.now();
    const time = (now - init.current) / 1000;
    const delta = (now - last.current) / 1000;
    // In seconds ~> you can do ms or anything in userland
    cb({ time, delta });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, deps); // Make sure to change it if the deps change
};
