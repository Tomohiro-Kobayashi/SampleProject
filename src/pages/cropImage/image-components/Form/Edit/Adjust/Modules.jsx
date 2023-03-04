// ===============
// reducerとか
// ===============

import { PADDING } from "./Root";

export const initialSize = {
  base: 0, //表示領域サイズ基準値 スマホだと可変
  viewW: 1, //表示領域比率(アイコンか背景かで比率可変)
  viewH: 1,
  imgWidth: 1, //読み込んだ画像のサイズ(baseに合わせたpx)
  imgHeight: 1,
  imgAspect: 1, //画像アスペクト比
  imgAspectHW: 1,
  orientation: "portrait", //画像の横合わせ・縦合わせ
  isBg: false
};

export const sizeReducer = (
  size,
  action
) => {
  switch (action.type) {
    case "UPDATE":
      const width = action.width;
      const img = action.img;
      const isBg = action.isBg;
      const base = width - PADDING * 2;

      // 縦長か横長によって幅合わせか高さ合わせ
      const imgAspect = img.width / img.height;
      const imgAspectHW = img.height / img.width;

      // 背景画像は幅合わせ固定
      let imgWidth, imgHeight, orientation;
      if (imgAspect <= 1 || isBg) {
        orientation = "portrait";
        imgWidth = base;
        imgHeight = base * imgAspectHW;
      } else {
        orientation = "landscape";
        imgWidth = base * imgAspect;
        imgHeight = base;
      }

      // 青い表示領域のサイズ、背景の場合は3:1に
      const viewW = !isBg ? 1 : 1;
      const viewH = !isBg ? 1 : 1 / 3;
      return {
        ...size,
        base: base,
        imgAspect: imgAspect,
        imgAspectHW: imgAspectHW,
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        viewW: viewW,
        viewH: viewH,
        orientation: orientation,
        isBg: isBg
      };
  }
  return { ...size };
};
