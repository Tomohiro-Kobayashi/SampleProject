const uiConfigs = {
  style: {
    gradientBgImage: {
      dark: {
        backgroudImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)",
      },
      light: {
        backgroudImage:
          "linear-gradient(to top, rgba(245, 245, 245, 1, rgba(0,0,0,0)",
      },
    },
    horizontalGradientBgImage: {
      dark: {
        backgroudImage:
          "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0)",
      },
      light: {
        backgroudImage:
          "linear-gradient(to right, rgba(245, 245, 245, 1, rgba(0,0,0,0)",
      },
    },
    typoLines: (lines, textAlign) => ({
      textAlign: textAlign || "justify",
      display: "-webkit-box",
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: lines,
    }),
    mainContent: {
      maxWidth: "1366px",
      margin: "auto",
      padding: 2,
    },
    backgroudImage: (imgPath) => ({
      position: "relative",
      backgroundSize: "cover",
      backgroudPosition: "center",
      backgroudColor: "darkgrey",
      backgroundImage: `url(${imgPath})`,
    }),
  },
  size: {
    sidebarWidth: "600px",
    contentMaxWidth: "1366px",
  },
};

export default uiConfigs;
