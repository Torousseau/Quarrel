import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DefaultPage from "./pages/DefaultPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DefaultPage />} />



                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
}
