import React, { useRef, useContext } from "react";
import styled, { css } from "styled-components";

import { ImagesContext } from "../../Root";
import { AdjustContext } from "./Root";
import { useAnimationFrame } from "../../../../image-utils/Function";
import { target } from "./Main";

const transform = (target, size) => {
    const x = target.currentPos.x * size.base; // 正規化した数値からpx指定に
    const y = target.currentPos.y * size.base;
    const originX = target.origin.x * 100; // パーセント指定に*100
    const originY = target.origin.y * 100;
    return {
      transform: `translate(${x}px, ${y}px) rotate(${target.rotate}deg) scale(${target.scale})`,
      transformOrigin: `${originX}% ${originY}%`
    };
  };

const Img = () => {

    const { image, isBg } = useContext(ImagesContext);
    const { size } = useContext(AdjustContext);
    const ref = useRef();
    const originRef = useRef();
  
    useAnimationFrame(() => {
      // refにtickで反映
      if (!ref.current) return;
      Object.assign(ref.current.style, transform(target, size));
      Object.assign(originRef.current.style, {
        top: `${target.origin.y * 100}%`,
        left: `${target.origin.x * 100}%`
      });
    }, [ref, originRef, size]);

  return (
    <Root ref={ref} size={size} isBg={isBg}>
      <div className="img">
        <img src={image.previewUrl} alt="プレビュー画像" />
        <div className="origin" ref={originRef}></div>
      </div>
    </Root>
  )
}

export default Img

const Root = styled.div`
  pointer-events: none;
  position: relative;
  width: 100%;
  height: 100%;
  .img {
    position: absolute;
    width: ${(props) => props.size.imgWidth}px;
    height: ${(props) => props.size.imgHeight}px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      position: relative;

      ${(props) =>
        props.size.imgAspect >= 1
          ? // 横長
            css`
              height: 100%;
            `
          : // 縦長
            css`
              width: 100%;
            `}
    }
  }
  .origin {
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: rgba(0, 0, 0, 1);
    z-index: 1000;
    border-radius: 100%;
    transform: translate(-50%, -50%);
    display: none;
  }
`;