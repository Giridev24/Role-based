import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import UploadPage from "./components/Uploadpage";
import Client from "./components/Client";


function App() {
  

  return (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/new" element={<Signup/>} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/client/:email" element={<Client />} />
     
    </Routes>
  </Router>
  )
}

export default App
