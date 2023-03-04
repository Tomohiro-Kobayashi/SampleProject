// ===============
// 調整用クラス
// ===============
import Point from "./point";

export class RectTarget {
   isBg = false; // 背景画像 or アイコン画像
   currentPos = new Point(); // 現在座標
   targetPos = new Point(0, 0); // 目標座標
   sizeRatio = new Point(); //縦横の比率
   origin = new Point(0.5, 0.5); //原点
   scale= 1;
   minScale = 1;
   rotate = 0;
   isInside = false; //はみだしたかどうか
   tempPos = new Point(); // inside()でなんかあった時用
   insideLoop = 0; //再帰の保険

  constructor() {
    this.update();
  }
  // https://qiita.com/ryokomy/items/0d1a879cac59a0bfbdc5
  // 回転によって最小スケール
   rotateMinScale(size) {
    const radian = this.radian();
    let rot_w =
      size.viewH * Math.abs(Math.sin(radian)) +
      size.viewW * Math.abs(Math.cos(radian));
    let rot_h =
      size.viewH * Math.abs(Math.cos(radian)) +
      size.viewW * Math.abs(Math.sin(radian));
    // 背景画像かつ横長画像の場合の考慮
    if (this.isBg && this.sizeRatio.x > this.sizeRatio.y) {
      rot_w = rot_w * (1 / this.sizeRatio.x);
      rot_h = rot_h * (1 / this.sizeRatio.y);
    }
    this.minScale = Math.max(rot_w, rot_h);
    return this.minScale;
  }

  // 角度からラジアン
   radian() {
    return this.rotate * (Math.PI / 180);
  }

  // 対角線
   diagonal() {
    return {
      length: Math.sqrt(
        Math.pow(this.sizeRatio.x, 2) + Math.pow(this.sizeRatio.y, 2)
      ),
      radian: Math.atan(this.sizeRatio.y / this.sizeRatio.x),
      angle: Math.atan(this.sizeRatio.y / this.sizeRatio.x) * (180 / Math.PI)
    };
  }

  // 矩形の各頂点を返す
   vertex() {
    const dlength = this.diagonal().length * 0.5; //矩形対角線の長さの半分(中心点からの距離)
    const dradian = this.diagonal().radian; //矩形対角線のラジアン
    //----------------------------
    // 矩形中心を基準点とした頂点(左上から時計回り)の初期値
    let vertices = [
      new Point(
        Math.cos(Math.PI + dradian) * dlength,
        Math.sin(Math.PI + dradian) * dlength
      ),
      new Point(Math.cos(-dradian) * dlength, Math.sin(-dradian) * dlength),
      new Point(Math.cos(dradian) * dlength, Math.sin(dradian) * dlength),
      new Point(
        Math.cos(Math.PI - dradian) * dlength,
        Math.sin(Math.PI - dradian) * dlength
      )
    ];
    //----------------------------
    // アフィン変換で回転・拡大・平行移動する
    // まとめて合成した方がいいんだろうけど一旦順にやる
    //----------------------------
    // 要素センターから左上(0,0)基準に移動
    vertices = vertices.map((p) => {
      return new Point(p.x + 0.5, p.y + 0.5);
    });
    // アフィン変換の基準点(cssのoriginは下にプラスなので注意)
    const reference = new Point(+this.origin.x, +this.origin.y);
    // 拡大縮小
    vertices = vertices.map((p) => {
      return new Point(
        (p.x - reference.x) * this.scale + reference.x,
        (p.y - reference.y) * this.scale + reference.y
      );
    });
    // 回転反映
    const radian = this.rotate * (Math.PI / 180);
    vertices = vertices.map((p) => {
      return new Point(
        (p.x - reference.x) * Math.cos(radian) +
          (p.y - reference.y) * -Math.sin(radian) +
          reference.x,
        (p.x - reference.x) * Math.sin(radian) +
          (p.y - reference.y) * Math.cos(radian) +
          reference.y
      );
    });
    // 移動値反映
    vertices = vertices.map((p) => {
      return new Point(p.x + this.targetPos.x, p.y + this.targetPos.y);
    });
    // イプシロン見にくいのでデバッグ用丸め込み
    vertices = vertices.map((p) => {
      return p.rounded();
    });
    return vertices;
  }

  // 表示領域の左上の座標(操作する画像左上の頂点座標を(0,0)として見た時の)
   viewTopLeft() {
    const radian = this.radian();
    const p = new Point(-this.vertex()[0].x, -this.vertex()[0].y); // 左上の頂点座標
    // rotate分(0,0)で逆回転した座標
    const rot = new Point(
      p.x * Math.cos(-radian) - p.y * Math.sin(-radian),
      p.x * Math.sin(-radian) + p.y * Math.cos(-radian)
    );
    // 差分にスケール反映
    const ret = new Point(rot.x / this.scale, rot.y / this.scale);
    return ret;
  }

  // オリジン変更の目標座標
   targetOrigin(target) {
    const topleft = this.viewTopLeft();
    const radian = this.radian();
    // 表示領域内の目標(マウス位置とかの)値 (0.0 ~ 1.0 / scale)
    const targetPoint = new Point(target.x / this.scale, target.y / this.scale);
    // 回転反映
    const tp = new Point(
      targetPoint.x * Math.cos(-radian) - targetPoint.y * Math.sin(-radian),
      targetPoint.x * Math.sin(-radian) + targetPoint.y * Math.cos(-radian)
    );
    // 縦横比に合わせて0.0 ~ 1.0以内に変換
    const p = new Point().add(topleft).add(tp);
    p.x = p.x / this.sizeRatio.x;
    p.y = p.y / this.sizeRatio.y;
    return p;
  }

  // オリジン更新 (変更時に表示上に移動しないように調整)
   updateOrigin(targetOrigin) {
    const radian = this.radian();
    // 変更前 / 変更後 のorigin
    const reference_before = new Point(+this.origin.x, +this.origin.y);
    const reference_after = new Point(+targetOrigin.x, +targetOrigin.y);

    // 変更前 / 変更後
    let before = new Point();
    let after = new Point();
    // スケール反映
    before = new Point(
      (before.x - reference_before.x) * this.scale + reference_before.x,
      (before.y - reference_before.y) * this.scale + reference_before.y
    );
    after = new Point(
      (after.x - reference_after.x) * this.scale + reference_after.x,
      (after.y - reference_after.y) * this.scale + reference_after.y
    );
    // 回転反映
    before = new Point(
      (before.x - reference_before.x) * Math.cos(radian) +
        (before.y - reference_before.y) * -Math.sin(radian) +
        reference_before.x,
      (before.x - reference_before.x) * Math.sin(radian) +
        (before.y - reference_before.y) * Math.cos(radian) +
        reference_before.y
    );
    after = new Point(
      (after.x - reference_after.x) * Math.cos(radian) +
        (after.y - reference_after.y) * -Math.sin(radian) +
        reference_after.x,
      (after.x - reference_after.x) * Math.sin(radian) +
        (after.y - reference_after.y) * Math.cos(radian) +
        reference_after.y
    );
    // 差分取る
    const diff = new Point(before.x - after.x, before.y - after.y);

    // 現在位置 + 差分;
    this.targetPos.x = this.targetPos.x + diff.x;
    this.targetPos.y = this.targetPos.y + diff.y;
    this.currentPos = this.targetPos;

    // オリジン変更
    this.origin.x = targetOrigin.x;
    this.origin.y = targetOrigin.y;
  }

  // 表示領域(左上から時計回りで座標返す)
   viewArea() {
    return !this.isBg
      ? [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 1)]
      : [
          new Point(0, 1 / 3),
          new Point(1, 1 / 3),
          new Point(1, 2 / 3),
          new Point(0, 2 / 3)
        ];
  }

  // 単純な移動
   moveto(to) {
    let state = false;
    this.targetPos = new Point(to.x, to.y);
    state = this.inside();
    return state;
  }

  // エリア内に収める
   inside() {
    //　再帰で移動繰り返してループしちゃった場合は元の場所に
    if (this.insideLoop === 0) {
      this.tempPos = new Point(this.currentPos.x, this.currentPos.y);
    }
    if (this.insideLoop > 100) {
      this.insideLoop = 0;
      this.targetPos.x = this.tempPos.x;
      this.targetPos.y = this.tempPos.y;
      return;
    }
    this.insideLoop++;

    const radian = this.radian();
    const vertex = this.vertex();
    const frame = this.viewArea();

    // 衝突(包含)判定
    // https://yttm-work.jp/collision/collision_0007.html#head_line_03
    // centerの座標を原点として逆回転ってなってるけど別に原点(0,0)でいい気がする
    const vertex_rot = vertex.map((p) => {
      return new Point(
        p.x * Math.cos(-radian) + p.y * -Math.sin(-radian),
        p.x * Math.sin(-radian) + p.y * Math.cos(-radian)
      );
    });
    // 表示領域も逆回転
    const frame_rot = frame.map((p) => {
      return new Point(
        p.x * Math.cos(-radian) + p.y * -Math.sin(-radian),
        p.x * Math.sin(-radian) + p.y * Math.cos(-radian)
      );
    });

    const eps = Number.EPSILON;
    // 回転した座標で当たり(包含)判定
    // [0]:左上 [1]:右上 [2]:右下 [3]:左下
    const frame_bool = frame_rot.map((frame) => {
      let bool = true;
      const topLeft = vertex_rot[0];
      if (frame.x + eps < topLeft.x) bool = false; // 左
      if (frame.y + eps < topLeft.y) bool = false; // 上
      const bottomRight = vertex_rot[2];
      if (frame.x - eps > bottomRight.x) bool = false; // 右
      if (frame.y - eps > bottomRight.y) bool = false; // 下
      return bool;
    });

    const isInside =
      frame_bool[0] && frame_bool[1] && frame_bool[2] && frame_bool[3];

    // 判定自体はここまででOK
    this.isInside = isInside;

    // エリア外に出た場合はinsideMoveから再帰
    if (!isInside) {
      this.insideMove(vertex_rot, frame_rot);
    } else {
      this.insideLoop = 0;
    }

    return this.isInside;
  }

  // ここではみ出した分移動制御用に数値取って収める
   insideMove(vertex_rot, frame_rot) {
    // console.log("insideMove");
    const radian = this.radian();
    // ゼロだと無限に再帰しちゃう時があるのでイプシロンで
    const eps = Number.EPSILON;
    // 差分
    const frame_diff = frame_rot.map((frame) => {
      const diff = {};
      const topLeft = vertex_rot[0];
      const bottomRight = vertex_rot[2];

      // 各辺との距離
      if (topLeft.x - frame.x > eps) {
        diff.left = topLeft.x - frame.x; // 左
      }
      if (topLeft.y - frame.y > eps) {
        diff.top = topLeft.y - frame.y; // 上
      }
      if (bottomRight.x - frame.x < -eps) {
        diff.right = bottomRight.x - frame.x; // 右
      }
      if (bottomRight.y - frame.y < -eps) {
        diff.bottom = bottomRight.y - frame.y; // 下
      }

      return diff;
    });

    // mapはbreakができないのでentries forで
    //@ts-ignore
    for (const [index, _frame] of Object.entries(frame_diff)) {
      const frame = _frame;
      if (frame.left) {
        const len = frame.left;
        const add = new Point(len * Math.cos(radian), len * Math.sin(radian));
        this.targetPos.x = this.targetPos.x - add.x;
        this.targetPos.y = this.targetPos.y - add.y;
        this.inside();
        break;
      }
      if (frame.right) {
        const len = frame.right;
        const add = new Point(len * Math.cos(radian), len * Math.sin(radian));
        this.targetPos.x = this.targetPos.x - add.x;
        this.targetPos.y = this.targetPos.y - add.y;
        this.inside();
        break;
      }
      if (frame.top) {
        const len = frame.top;
        const add = new Point(len * Math.sin(radian), len * Math.cos(radian));
        this.targetPos.x = this.targetPos.x + add.x;
        this.targetPos.y = this.targetPos.y - add.y;
        this.inside();
        break;
      }
      if (frame.bottom) {
        const len = frame.bottom;
        const add = new Point(len * Math.sin(radian), len * Math.cos(radian));
        this.targetPos.x = this.targetPos.x + add.x;
        this.targetPos.y = this.targetPos.y - add.y;
        this.inside();
        break;
      }
    }
  }

  // クリア
   clear() {
    this.scale = 1;
    this.rotate = 0;
    this.targetPos = new Point();
    this.currentPos = new Point();
  }

  // リサイズ
   resize(
    isBg,
    targetPos,
    sizeRatio,
    origin,
    scale,
    rotate
  ) {
    this.isBg = isBg;
    this.targetPos = targetPos || this.targetPos;
    this.sizeRatio = sizeRatio || this.sizeRatio;
    this.origin = origin || this.origin;
    this.scale = scale || this.scale;
    this.rotate = rotate || this.rotate;
  }

  // イージング処理
   update() {
    if (typeof window === "undefined") return;
    const factorNum = 0.3; // イージング 係数
    const diffX = Number(this.targetPos.x - this.currentPos.x);
    const diffY = Number(this.targetPos.y - this.currentPos.y);

    this.currentPos.x += diffX * factorNum;
    this.currentPos.y += diffY * factorNum;

    // // 繰り上げ・切り下げ 端数
    const fractionNum = 0.001;
    if (Math.abs(diffX) < fractionNum) {
      this.currentPos.x = this.targetPos.x;
    }
    if (Math.abs(diffY) < fractionNum) {
      this.currentPos.y = this.targetPos.y;
    }

    window.requestAnimationFrame(this.update.bind(this));
  }
}
