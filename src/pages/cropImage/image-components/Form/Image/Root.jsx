import React, {useContext} from "react";
import Files from "./Files";
import Preview from "./Preview";
import { ImagesContext } from "../Root";
import styled from "styled-components";

const Image = (props) => {
  const { label, isBg, sizeText } = props;

  const { setIconFile, setBgFile } = useContext(ImagesContext);
  const setFile = isBg ? setIconFile : setBgFile;

  return (
    <Root>
      <div className="row">
        <label htmlFor="image">{label}</label>
        <div className="col">
          <div>
            <Preview isBg={isBg} />
            <Files sizeText={sizeText} isBg={isBg} />
          </div>
        </div>
      </div>    
    </Root>
  );
};

export default Image;

const Root = styled.section``;