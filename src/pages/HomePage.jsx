import { Box, Button, ImageList, ImageListItem } from "@mui/material";
import React from "react";
import Image from "../assets/slide.png";
import { experimentalStyled as styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

const Item = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(10),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const HomePage = () => {
  return (
    <>
      <Box
        sx={{
          paddingTop: {
            xs: "60%",
            sm: "60%",
            md: "40%",
            lg: "35%",
          },
          marginBottom: "20px",
          backgroundPosition: "top",
          backgroundSize: "cover",
          backgroundImage: `url(${Image})`,
        }}
      ></Box>
      <Box
        sx={{ marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}
      >
        <ImageList
          sx={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))!important",
          }}
        >
          {Array.from(Array(4)).map((_, index) => (
            <ImageListItem key={index}>
              <Item>コンテンツ</Item>
            </ImageListItem>
          ))}
        </ImageList>

      </Box>
    </>
  );
};

export default HomePage;
