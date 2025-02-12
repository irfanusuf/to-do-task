import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/Navbar";
import Home from "./components/Home";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ResponsiveAppBar />

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
