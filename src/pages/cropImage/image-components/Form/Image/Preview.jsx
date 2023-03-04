import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { ImagesContext } from "../../Form/Root";

const Preview = (props) => {

  const { iconFile, bgFile } = useContext(ImagesContext);
  const { isBg } = props;
  const file = isBg ? iconFile : bgFile;
  const hasFile = "previewUrl" in file;

  return (
    <Root isBg={isBg}>
      {/* file画像がある場合 */}
      {hasFile && (
        <div className="img">
          <img src={file.previewUrl} alt="プレビュー画像" />
        </div>
      )}
      {/* file画像がない場合かつアイコンの場合アイコン表示 */}
      {!hasFile && !isBg && (
        <div className="img def">
          Icon
        </div>
      )}
    </Root>
  );
};

export default Preview;

const Root = styled.div`
  display: flex;
  justify-content: center;
  .img {
    font-size: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    svg {
      width: 110px;
    }
    ${(props) =>
      props.isBg
        ? ``
        : css`
            max-width: 200px;
            border-radius: 100%;
            width: 200px;
            height: 200px;
          `}
    overflow: hidden;
    margin-bottom: 20px;
    img {
      width: 100%;
    }
    &.def {
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 100%;
      img {
        margin-top: -10px;
      }
    }
  }
`;
