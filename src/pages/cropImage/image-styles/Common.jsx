import styled from "styled-components";
import { css } from "styled-components";
import { down } from "styled-breakpoints";


export const Page = styled.section`
  position: relative;
  padding: 0 20px;
  align-items: center;
  display: flex;
  height: 100vh;
`;
export const PageInner = styled.div`
  position: relative;

  margin: 0 auto;
  display: flex;
  justify-content: center;

  width: 1200px;
  flex-wrap: wrap;

  width: "800px";
  ${down("md")} {
    width: 100% !important;
  }
`;

const mixin = {
  button: css`
    margin: 0 10px;
    font-size: 14px;
    display: block;
    min-width: 120px;
    padding: 10px;
    text-align: center;
    color: #fff;
    border-radius: 3px;
    background-color: #000;
    transition: all 0.2s linear;
    display: inline-block;
  `,
  form: css`
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 25px;
      justify-content: space-between;
      padding: 0 10%;
      margin-top: 20px;
      ${down("md")} {
        padding: 0;
        display: block;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      input,
      textarea {
        &::placeholder {
          color: #ccc;
        }
      }
      & > label {
        display: inline-block;
        width: 25%;
        text-align: right;
        justify-content: right;
        padding: 10px;
        padding-right: 0px;
        font-weight: bold;
        sup {
          vertical-align: top;
          font-size: 12px;
          color: #dc3545;
          margin-left: 3px;
        }
        ${down("md")} {
          width: 100%;
          display: block;
          text-align: left;
          padding-left: 0;
        }
      }
      .fakeCol {
        display: inline-block;
        width: 25%;
        ${down("md")} {
          display: none;
        }
      }
      .error {
        margin-top: 10px;
        font-size: 12px;
        color: #dc3545;
      }
      .col {
        width: 100%;
        ${down("md")} {
          width: 100%;
        }
      }
      .form-control {
        display: block;
        width: 100%;

        padding: 0.375rem 0.75rem;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        box-sizing: border-box;
      }

      .form-check-label {
        display: inline-block;
        margin-top: 5px;
        margin-left: 5px;
        vertical-align: -2px;
        span {
          display: inline-block;
          vertical-align: 3px;
          font-size: 13px;
        }
        ${down("md")} {
          margin-top: 0px;
          span {
            vertical-align: 4px;
          }
        }
      }
      &.row--image {
        .col {
          margin-top: -16px;
        }
      }
      p {
        margin-bottom: 10px;
        a {
          font-size: 13px;
          color: #007bfe;
          text-decoration: underline;
        }
      }
    }
  `
};

export default mixin;

export const Modal = styled.div`
  margin-top: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: all 0.4s linear;
  font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ",
    Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  padding: 10px;
  box-sizing: border-box;

  &[data-ismodal="true"] {
    pointer-events: auto;
    opacity: 1;
  }
  .inner {
    box-sizing: border-box;
    width: 600px;
    max-height: calc(100vh - 100px);
    padding: 20px;
    background-color: rgba(255, 255, 255, 1);
    position: relative;
    border-radius: 5px;

    ${down("md")} {
      width: 100%;
      padding: 20px 10px;
    }
  }
  .close {
    position: absolute;
    top: -60px;
    right: 0px;
    width: 40px;
    height: 40px;
    button {
      display: inline-block;

      width: 40px;
      height: 40px;

      cursor: pointer;

      background-image: linear-gradient(
          -45deg,
          transparent calc(50% - 1px),
          #fff calc(50% - 1px),
          #fff calc(50% + 1px),
          transparent calc(50% + 1px)
        ),
        linear-gradient(
          45deg,
          transparent calc(50% - 1px),
          #fff calc(50% - 1px),
          #fff calc(50% + 1px),
          transparent calc(50% + 1px)
        );
    }
  }
`;
