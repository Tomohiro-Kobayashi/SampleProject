import { Box, Button } from "@mui/material";
import React from "react";
import Image from "../assets/slide.png"
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';


const Item = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(12),
  textAlign: 'center',
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
      >
      </Box>
      <Box sx={{  marginLeft: "20px", marginRight: "20px", marginBottom: "20px"}}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Array.from(Array(4)).map((_, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Item>コンテンツ</Item>
          </Grid>
        ))}
      </Grid>
    </Box>

    </>
  );
};

export default HomePage;
