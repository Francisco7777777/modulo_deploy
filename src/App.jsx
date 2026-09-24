import "./App.css";

import { Outlet } from "react-router-dom";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

function App() {
  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover={true}
        draggable={false}
        transition={Zoom}
      />
      <Outlet />
    </>
  );
}

export default App;
