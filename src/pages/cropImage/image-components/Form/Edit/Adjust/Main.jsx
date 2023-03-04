import Point from "../../../../image-utils/point";
import React, { useEffect, useCallback, useContext } from "react";
import styled from "styled-components";

import Img from "./Img";

import { AdjustContext } from "./Root";
import { ImagesContext } from "../../Root";
import {
  clientPosision,
  updateScale,
  updateRotate,
  touchDeg
} from "../../../../image-utils/Function";
import { RectTarget } from "../../../../image-utils/RectTarget";

const dataInit = () => {
    return {
      isDown: false,
      start: [new Point()], // 始点(ジェスチャー用に配列で)
      current: [new Point()], // 現在値(ジェスチャー用に配列で)
      diff: new Point(), //start - currentの差分
      temp: new Point(), //ダウン時の前回値保持
      tempScale: 1,
      rotMinScale: 1,
  
      // ジェスチャー用
      tempRotate: 0,
      tempDeg: 0
    };
  };
  export let data = dataInit();
  export let target = new RectTarget(); //調整用クラス

const Main = () => {

    const { image } = useContext(ImagesContext);
    const {
      size,
      scale,
      setScale,
      rotate,
      setRotate,
      targetOrigin,
      setTargetOrigin
    } = useContext(AdjustContext);
  
    // ============================
  
    // ============================
    const onDown = useCallback(
      (e) => {
        e.preventDefault();
        data.isDown = true;
        data.diff = new Point();
        data.start = clientPosision(e, size);
        data.current = clientPosision(e, size);
        data.temp = new Point(target.currentPos.x, target.currentPos.y);
        // -----------------
        // ジェスチャー処理
        // -----------------
        if (!e.touches || e.touches.length <= 1) return;
        data.tempScale = +target.scale;
        data.tempDeg = touchDeg(data.start);
        data.tempRotate = +target.rotate;
        // ジェスチャー時は開始時の中間点にorigin変更
        const p = Point.interpolate(data.start[0], data.start[1], 0.5);
        const to = target.targetOrigin(p);
        setTargetOrigin(new Point(to.x, to.y));
      },
      [size, scale, image]
    );
  
    const onMove = useCallback(
      (e) => {
        e.preventDefault();
        if (!data.isDown) return;
        data.current = clientPosision(e, size);
        // PC処理 / SP指一本の時は移動のみ
        if (!e.touches || e.touches.length <= 1) {
          data.diff = new Point(data.current[0].x, data.current[0].y).subtract(
            data.start[0]
          );
          const to = new Point(
            data.temp.x + data.diff.x,
            data.temp.y + data.diff.y
          );
  
          // 範囲外に出た場合は一旦解除して再度onDown
          if (!target.moveto(to)) {
            data.isDown = false;
            onDown(e);
          }
          return;
        }
        // -----------------
        // ジェスチャー処理
        // -----------------
        let _rotate = updateRotate(data.current, data.tempDeg, data.tempRotate);
        _rotate = _rotate % 360;
        setRotate(_rotate); // 回転
        let _scale = updateScale(data.current, data.start, data.tempScale);
        setScale(_scale); // スケーリング
      },
      [size, image]
    );
  
    const onUp = useCallback(() => {
      data.isDown = false;
    }, []);
  
    const changeOrigin = () => {
      // デフォ・PCは表示領域中心
      let p = new Point(0.5, 0.5);
      if (data.isDown && data.current.length > 1) {
        // ジェスチャー時は開始時の中間点にorigin変更
        p = Point.interpolate(data.start[0], data.start[1], 0.5);
      }
      const to = target.targetOrigin(p);
      setTargetOrigin(new Point(to.x, to.y));
    };
  
    // スケール変更に合わせてオリジン変更する
    useEffect(() => {
      target.scale = scale;
      changeOrigin();
    }, [scale]);
  
    // オリジン変更時に見た目的に移動しないように調整
    useEffect(() => {
      target.updateOrigin(targetOrigin);
      target.inside();
    }, [targetOrigin]);
  
    // 回転
    useEffect(() => {
      // UIから操作の場合は表示領域中心にオリジン変更
      if (!data.isDown) {
        changeOrigin();
      }
      target.rotate = rotate % 360;
      data.rotMinScale = target.rotateMinScale(size);
      if (scale < data.rotMinScale) {
        setScale(data.rotMinScale);
        data.isDown = false;
      }
    }, [rotate]);
  
    // リサイズ処理
    useEffect(() => {
      let rectW = 1,
        rectH = 1;
      if (size.orientation === "portrait") {
        rectH = size.imgAspectHW;
      } else {
        rectW = size.imgAspect;
      }
  
      target.resize(
        size.isBg,
        target.targetPos,
        new Point(rectW, rectH),
        target.origin,
        target.scale,
        target.rotate
      );
    }, [size]);
  
    useEffect(() => {
      target = new RectTarget();
      data = dataInit();
    }, [image]);

  return (
    <Root className="main">
      <div
        className="eventArea"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        // ==================================
        // デバッグ用
        // ==================================
        onClick={(e) => {
          const p = clientPosision(e, size)[0];
          if (e.shiftKey) {
            const to = target.targetOrigin(new Point(p.x, p.y));
            setTargetOrigin(new Point(to.x, to.y));
          }
        }}
      ></div>
      <Img />

      {/* <Debug /> */}
    </Root>
  );
}

export default Main

const Root = styled.div`
  position: absolute;
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  cursor: move;
  z-index: 100;
  .eventArea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;