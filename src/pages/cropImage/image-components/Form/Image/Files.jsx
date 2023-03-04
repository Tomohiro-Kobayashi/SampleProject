import React, { useState, useCallback, useContext } from "react";
import styled from "styled-components";
import { down } from "styled-breakpoints";

import { ImagesContext } from "../Root";

export const readerOnLoadend = async (data) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(data);
  });
};

export const imgOnLoad = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

const Files = (props) => {
  const { setImage, setIsModal, setIsBg, setIconFile, setBgFile } =
    useContext(ImagesContext);
  const { sizeText, isBg } = props;
  const [isDrag, setIsDrag] = useState(false);
  const setFile = isBg ? setIconFile : setBgFile;

  const fileData = useCallback(
    (files) => {
      const file = files[0];
      (async () => {
        const reader = await readerOnLoadend(file);
        const image = await imgOnLoad(reader.result);
        setImage({
          elm: image,
          previewUrl: reader.result,
        });
        setIsModal(true);
      })();

      setIsBg(isBg); //awaitでズレが生じるのでisBgはここで
    },
    [isBg]
  );

  const handleChangeFile = useCallback(
    (e: any) => {
      setImage({});
      fileData(e.target.files);
      e.target.value = ""; // 同一データだと反応しなくなるので空に
    },
    [isBg]
  );

  const clear = useCallback(() => {
    setImage({});
    setFile({});
  }, []);

  return (
    <Root>
      <div
        className="drop"
        data-drag={isDrag}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDrag(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDrag(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDrag(false);
          fileData(e.dataTransfer.files);
        }}
      >
        ここにファイルをドロップ
        <br />
        <span>または</span>
        <label>
          ファイルを選択
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChangeFile(e)}
          />
        </label>
      </div>
      <div className="note">{sizeText}</div>
      <div className="clear">
        <ClearBtn onClick={clear}>クリア</ClearBtn>
      </div>
      <div className="error"></div>
    </Root>
  );
};

export default Files;

const ClearBtn = styled.button`
  font-size: 14px;
  display: inline-block;
  min-width: 120px;
  padding: 10px;
  text-align: center;
  color: #333;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.01);
  margin-left: 0px;
  margin-top: 25px;
  @include hover();
`;

const Root = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .drop {
    width: 50%;
    border: 5px dotted rgba(0, 0, 0, 0.3);
    padding: 25px 40px;
    margin: 0 auto;
    text-align: center;
    border-radius: 10px;
    line-height: 1.7;
    font-size: 18px;
    ${down("md")} {
      padding: 25px 20px;
    }

    span {
      display: block;
      margin-bottom: 3px;
      font-size: 14px;
    }
    label {
      padding: 5px 10px;
      border-radius: 3px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      background-color: rgba(0, 0, 0, 0.01);
      font-size: 14px;
      display: inline-block;
      cursor: pointer;
      input {
        display: none;
      }
    }
  }

  .drop[data-drag="true"] {
    border-color: #17a2b8;
  }

  .note {
    font-size: 10px;
    text-align: right;
    margin-top: 10px;
    width: 100%;
    color: #666;
  }

  .clear {
    text-align: center;
    width: 100%;
  }
`;
