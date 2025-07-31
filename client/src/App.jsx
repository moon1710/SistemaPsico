import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
// Import other pages like Register, Dashboard, etc.
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          {/* Redirect to login by default */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
