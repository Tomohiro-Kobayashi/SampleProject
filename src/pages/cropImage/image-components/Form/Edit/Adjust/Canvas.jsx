import React, { useRef, useEffect, useState, useMemo, useContext } from "react";
import styled from "styled-components";
import Point from "../../../../image-utils/point";
import { ImagesContext } from "../../Root";
import { AdjustContext } from "./Root";
import { target } from "./Main";

const draw = (ctx, img, size, isBg) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 縦長 or 横長
    const imgAspect = size.imgAspect;
    const imgAspectHW = size.imgAspectHW;
    // 背景は横合わせ固定
    const bool = imgAspect <= 1 || isBg;
  
    const drw = bool ? ctx.canvas.width : ctx.canvas.height * imgAspect;
    const drh = bool ? ctx.canvas.width * imgAspectHW : ctx.canvas.height;
  
    const radian = target.radian();
    const vertex = target.vertex();
    const p1 = new Point(vertex[0].x, vertex[0].y);
    // 画像の左上頂点座標
    const reference = new Point(
      p1.x * ctx.canvas.width,
      !isBg ? p1.y * ctx.canvas.height : (p1.y - 1 / 3) * ctx.canvas.width
    );
  
    ctx.save();
    ctx.translate(reference.x, reference.y);
    ctx.rotate(radian);
    ctx.scale(target.scale, target.scale);
    ctx.drawImage(img, 0, 0, drw, drh);
    ctx.restore();
  };

const Canvas = () => {

    const {
        image,
        cvApply,
        setCvApply,
        isBg,
        setIconFile,
        setBgFile
      } = useContext(ImagesContext);
      const { size } = useContext(AdjustContext);
      const setFile = isBg ? setIconFile : setBgFile;
    
      const canvasRef = useRef();
      const [ctx, setCtx] = useState(null);
      const [img, setImg] = useState(null);
    
      const cvsize = useMemo(() => {
        return !isBg ? { w: 400, h: 400 } : { w: 1500, h: 500 };
      }, [isBg]);
    
      useEffect(() => {
        const canvas = canvasRef.current;
        setCtx(canvas.getContext("2d"));
      }, []);
    
      useEffect(() => {
        if (ctx == null) return;
        if (image.elm === undefined) return;
        setImg(image.elm);
      }, [image]);
    
      useEffect(() => {
        // console.log("draw");
        if (ctx == null) return;
        if (img == null) return;
        //draw
        draw(ctx, img, size, isBg);
        //fileにblob反映
        const canvas= canvasRef.current;
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setFile({
            file: new File([blob], "name"),
            previewUrl: url
          });
        }, "image/jpeg");
      }, [cvApply]);

  return (
    <Root cvsize={cvsize} isBg={isBg}>
      <canvas ref={canvasRef} width={cvsize.w} height={cvsize.h}></canvas>
      <button
        className="enter"
        onClick={() => {
          setCvApply(!cvApply);
        }}
      >
        draw
      </button>
    </Root>
  );
}

export default Canvas

const Root = styled.div`
  /* 背景の場合は表示上のサイズダウン(デバッグ用)*/
  width: ${(props) =>
    props.isBg ? props.cvsize.w / 2 : props.cvsize.w}px;
  height: ${(props) =>
    props.isBg ? props.cvsize.h / 2 : props.cvsize.h}px;

  position: fixed;
  top: 0;
  right: 0;
  opacity: 0.8;
  text-align: center;
  pointer-events: none;
  display: none;

  background: linear-gradient(
      45deg,
      #999 25%,
      transparent 25%,
      transparent 75%,
      #999 75%
    ),
    linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;

  canvas {
    width: 100%;
    height: 100%;
  }

  button {
    display: inline-block;
    margin-top: 10px;
    background-color: #fff;
    padding: 5px 20px;
  }
`;