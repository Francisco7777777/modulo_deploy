import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import Login from "./pages/login/Login.jsx";
import Home from "./pages/home/Home.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";

const pages = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      {
        path: "/home",
        element: (
          <RotaProtegida>
            <Home />
          </RotaProtegida>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={pages}></RouterProvider>
  </StrictMode>,
);
