import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/Navbar";
import Home from "./components/Home";
import Todos from "./components/Todos";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ResponsiveAppBar />

        <Routes>
          <Route path="/" element={<Todos />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
