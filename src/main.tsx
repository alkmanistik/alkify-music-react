import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";

const LoginFormWithRouter = () => {
    const navigate = useNavigate();

    return (
        <LoginForm
            onSuccess={() => navigate("/")}
            switchToRegister={() => navigate("/register")}
        />
    );
};

const RegisterFormWithRouter = () => {
    const navigate = useNavigate();

    return (
        <RegisterForm
            onSuccess={() => navigate("/")}
            switchToLogin={() => navigate("/login")}
        />
    );
};

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginFormWithRouter />} />
            <Route path="/register" element={<RegisterFormWithRouter />} />
        </Routes>
    </BrowserRouter>
);
