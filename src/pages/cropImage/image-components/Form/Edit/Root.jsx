import React, {useEffect, useContext, useCallback} from "react";
import commonStyle, { Modal } from "../../../image-styles/Common";
import styled from "styled-components";
import { down } from "styled-breakpoints";
import Adjust from "./Adjust/Root";
import { ImagesContext } from "../Root";

const Edit = () => {
  const { isModal, setIsModal, cvApply, setCvApply } =
    useContext(ImagesContext);
  const keyDown = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setIsModal(false);
      }
    },
    [setIsModal]
  );
  const disableTouch = (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", keyDown);
    document.body.addEventListener("touchstart", disableTouch, {
      passive: false
    });
    document.body.addEventListener("touchmove", disableTouch, {
      passive: false
    });
    return () => {
      document.body.removeEventListener("keydown", keyDown);
      document.body.removeEventListener("touchstart", disableTouch);
      document.body.removeEventListener("touchmove", disableTouch);
    };
  }, [keyDown]);

  // モーダル時のbodyスタイル
  useEffect(() => {
    if (typeof window === "undefined") return;
    const delay = 100;
    if (isModal) {
      const currentY = window.pageYOffset || document.documentElement.scrollTop;
      const style = `position: fixed; top: ${-currentY}px; overflow: hidden;`;
      window.setTimeout(() => {
        document.body.setAttribute("style", style);
        document.body.setAttribute("data-currentY", "" + currentY);
      }, delay);
    } else {
      const currentY = +document.body.getAttribute("data-currentY");
      const style = `position: relative; top: auto;`;
      document.body.setAttribute("style", style);
      window.setTimeout(() => {
        window.scrollTo(0, currentY);
      }, 1);
    }
  }, [isModal]);
  return (
    <Root data-ismodal={isModal}>
    <div
      className="inner"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <p className="ttl">画像調整</p>
      <Adjust />
      <div className="ui">
        <div className="btn">
          <button
            className="enter"
            onClick={() => {
              setCvApply(!cvApply); // canvasに描画
              setIsModal(false);
            }}
          >
            適用
          </button>
          <button
            className="clear"
            onClick={() => {
              setIsModal(false);
            }}
          >
            クリア
          </button>
        </div>
      </div>
    </div>
  </Root>

  );
};

export default Edit;

const Root = styled(Modal)`
  margin-top: 0;
  padding: 20px;
  z-index: 10000;
  .inner {
    padding: 30px 0px;
    width: 100%;
    max-width: 550px;
    background-color: #fff;
    ${down("md")} {
      max-height: calc(100vh - 100px);
    }
  }
  .ttl {
    font-weight: bold;
    border-left: 4px solid #000;
    padding-left: 10px;
    font-size: 20px;
    margin-left: 25px;
  }
  .ui {
    margin-top: 25px;
    text-align: center;
  }
  .btn {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    button {
      ${commonStyle.button}
      margin: 0 10px;
      &.clear {
        color: #333;
        border: 1px solid rgba(0, 0, 0, 0.3);
        background-color: rgba(0, 0, 0, 0.01);
      }
    }
  }
`;
