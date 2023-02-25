import HomePage from "../pages/HomePage";
import ContentPrint from "../pages/ContentPrint";
import Posts from "../pages/Posts";
import Netprint from "../pages/Netprint";
import PersonDetail from "../pages/PersonDetail";

export const routesGen = {
  home: "/",
  person: (id) => `/person/${id}`,
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/person/:personId",
    element: <PersonDetail />,
    state: "person.detail",
  },
  {
    path: "/posts",
    element: <Posts />,
    state: "posts",
  },
  {
    path: "/netprint",
    element: <Netprint />,
    state: "netprint",
  },
  {
    path: "/contentprint",
    element: <ContentPrint />,
    state: "contentprint",
  },
  {
    path: "contentprint/:mediaId",
    element: <ContentPrint />,
  },
];

export default routes;
