import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Wardrobe } from "./pages/Wardrobe";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/wardrobe",
    Component: Wardrobe,
  },
]);
