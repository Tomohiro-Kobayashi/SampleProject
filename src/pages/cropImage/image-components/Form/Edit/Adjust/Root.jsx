import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  useReducer,
  createContext,
} from "react";
import Point from "../../../../image-utils/point";
import styled from "styled-components";
import { ImagesContext } from "../../Root";
import Canvas from "./Canvas";

import { sizeReducer, initialSize } from "./Modules";

import Main, { data, target } from "./Main";
import { useAnimationFrame } from "../../../../image-utils/Function";

export const PADDING = 25;
export const AdjustContext = createContext(null);

const rotState = {
  increment: false,
  decrement: false,
};

const Adjust = () => {
  const { image, isBg } = useContext(ImagesContext);
  const [size, setSize] = useReducer(sizeReducer, initialSize);
  const [scale, setScale] = useState(1.0);
  const [rotate, setRotate] = useState(0);
  const [targetOrigin, setTargetOrigin] = useState(new Point(0.5, 0.5));
  const boxRef = useRef(null);
  const context = {
    size,
    scale,
    setScale,
    rotate,
    setRotate,
    targetOrigin,
    setTargetOrigin,
  };

  // リサイズ
  const resize = useCallback(() => {
    const img = image.elm;
    if (img === undefined) return;
    (async () => {
      // スクロールバーの表示・非表示の状態によって取得する幅が変動するので若干delayかける
      await new Promise((resolve) => setTimeout(resolve, 300));
      const width = boxRef.current.getBoundingClientRect().width; // 幅取得
      // 要素サイズ反映
      setSize({
        type: "UPDATE",
        width: width,
        img: img,
        isBg: isBg,
      });
    })();
  }, [image, isBg, size, boxRef]);

  // 初回リサイズ
  useEffect(() => {
    resize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [image, isBg, size, boxRef]);

  // 画像切替でクリア＆リサイズ
  const clear = useCallback(() => {
    target.clear();
    data.rotMinScale = 1;

    setScale(target.scale);
    setRotate(target.rotate);
    setTargetOrigin(new Point(0.5, 0.5));
  }, []);

  // depsはimageじゃなくてもいいような気はするけど
  useEffect(() => {
    clear();
    resize();
  }, [image]);

  // ==================================
  // 左右キーで回転
  // ==================================
  // 長押しで回転
  useAnimationFrame(() => {
    if (rotState.increment) setRotate(rotate + 1);
    if (rotState.decrement) setRotate(rotate - 1);
  }, [rotate]);

  const keyDown = (e) => {
    let v = 1;
    if (e.shiftKey) v = 5;
    if (e.keyCode == 39) setRotate(rotate + 1 * v);
    if (e.keyCode == 37) setRotate(rotate - 1 * v);
  };
  useEffect(() => {
    document.body.addEventListener("keydown", keyDown);
    return () => {
      document.body.removeEventListener("keydown", keyDown);
    };
  }, [rotate]);

  return (
    <AdjustContext.Provider value={context}>
      <Root ref={boxRef}>
        <Canvas />
        <Box
          size={size}
          padding={PADDING}
          className={isBg ? "box isBg" : "box"}
        >
          <div className="frame"></div>
          <div className="rectorg"></div>
          <div className="rect"></div>
          <div className="mask"></div>
          <Main />
        </Box>

        <div className="ui">
          <button
    
            onMouseDown={() => {
              rotState.decrement = true;
            }}
            onMouseUp={() => {
              rotState.decrement = false;
            }}
            onTouchStart={() => {
              rotState.decrement = true;
            }}
            onTouchEnd={() => {
              rotState.decrement = false;
            }}
          >左回転</button>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={scale}
            onChange={(e) => {
              const s = Math.max(e.target.value, data.rotMinScale);
              setScale(s);
            }}
          />
          <button
            onMouseDown={() => {
              rotState.increment = true;
            }}
            onMouseUp={() => {
              rotState.increment = false;
            }}
            onTouchStart={() => {
              rotState.increment = true;
            }}
            onTouchEnd={() => {
              rotState.increment = false;
            }}
          >右回転</button>
        </div>
      </Root>
    </AdjustContext.Provider>
  );
};

export default Adjust;

const Box = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => props.size.base + props.padding * 2}px;
  margin-top: 16px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 25px;
  .rectorg {
    position: absolute;
    width: ${(props) => props.size.base}px;
    height: ${(props) => props.size.base}px;
    border: 1px solid #fff;
    box-sizing: border-box;
    z-index: 1000;
    pointer-events: none;
  }
  .rect {
    position: absolute;
    width: ${(props) => props.size.base}px;
    height: ${(props) => props.size.base * props.size.viewH}px;
    border: 1px solid #0dcaf0;
    box-sizing: border-box;
    z-index: 1000;
    pointer-events: none;
  }
  .frame {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: ${(props) => props.padding}px solid rgba(0, 0, 0, 0.6);
    z-index: 1000;
    pointer-events: none;
  }
  .mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
    width: ${(props) => props.size.base}px;
    height: ${(props) => props.size.base}px;
    z-index: 200;
    pointer-events: none;
    z-index: 900;
    mask: radial-gradient(circle, transparent 70%, rgba(0, 0, 0, 1) 70.5%);
  }
  &.isBg {
    .mask {
      display: none;
    }
    .rect {
      top: ${(props) => props.size.base * props.size.viewH + props.padding}px;
    }
    .frame {
      border-top: ${(props) =>
          props.size.base * props.size.viewH + props.padding}px
        solid rgba(0, 0, 0, 0.6);
      border-bottom: ${(props) =>
          props.size.base * props.size.viewH + props.padding}px
        solid rgba(0, 0, 0, 0.6);
    }
  }
`;
const Root = styled.div`
  width: 100%;
  * {
    box-sizing: border-box;
  }
  .ui {
    padding: 0 20px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    input {
      width: 260px;
      display: inline-block;
      margin: 0 10px;
    }
    svg {
      font-size: 20px;
      width: 30px;
    }
  }
`;
