import React, { useState, createContext } from "react";
import styled from "styled-components";
import commonStyle from "../../image-styles/Common";
import Image from "./Image/Root";
import Edit from "./Edit/Root";

export const ImagesContext = createContext(null);

const Root = styled.section`
  ${commonStyle.form}
`;

const UserForm = () => {
  const [image, setImage] = useState({}); //調整画像
  const [isModal, setIsModal] = useState(false); //モーダル表示・非表示
  const [cvApply, setCvApply] = useState(false); //canvasへの描画に利用
  const [isBg, setIsBg] = useState(false); //ここは全体のisBg

  const [iconFile, setIconFile] = useState({}); //postするfile(とプレビュー)
  const [bgFile, setBgFile] = useState({}); //背景用file

  const context = {
    isModal,
    setIsModal,
    cvApply,
    setCvApply,
    isBg,
    setIsBg,
    image,
    setImage,
    iconFile,
    setIconFile,
    bgFile,
    setBgFile,
  };
  return (
    <ImagesContext.Provider value={context}>
      <Root>
        <Image />
      </Root>
      <Edit />
    </ImagesContext.Provider>
  );
};

export default UserForm;
