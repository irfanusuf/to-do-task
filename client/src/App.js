import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ResponsiveAppBar from "./components/Navbar";
import Todos from "./components/Todos";
import CreateTask from "./components/CreateTodo";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ResponsiveAppBar />
        <Routes>
        <Route path="/" element={<Todos />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/create-todo" element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
