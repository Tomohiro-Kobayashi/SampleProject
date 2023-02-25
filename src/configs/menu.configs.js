import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

const main = [
  {
    display: "home",
    path: "/",
    icon: <HomeOutlinedIcon />,
    state: "home",
  },
  {
    display: "ネットプリント",
    path: "/netprint",
    icon: <SlideshowOutlinedIcon />,
    state: "netprint",
  },
  {
    display: "投稿一覧",
    path: "/posts",
    icon: <SearchOutlinedIcon />,
    state: "posts",
  },
  {
    display: "コンテンツプリント",
    path: "/contentprint",
    icon: <LiveTvOutlinedIcon />,
    state: "contentprint",
  },
];

const user = [
  {
    display: "ポートフォリオ",
    path: "/portfolio",
    icon: <FavoriteBorderOutlinedIcon />,
    state: "portforio",
  },
];

const menuConfigs = { main, user };

export default menuConfigs;
