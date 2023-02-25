import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Box } from "@mui/system";

const Posts = () => {
  return (
    <Box paddingY="60px" paddingLeft="1%" paddingRight="1%" alignItems="center">
    
      <ImageList sx={{gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))!important'}} >
        {itemData.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
        img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
        title: "Breakfast",
      },
      {
        img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        title: "Burger",
      },
      {
        img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
        title: "Camera",
      },
      {
        img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
        title: "Basketball",
      },
      {
        img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
        title: "Fern",
      },
      {
        img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
        title: "Mushrooms",
      },
      {
        img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
        title: "Tomato basil",
      },
  ];

export default Posts;
