import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { ArtistForm } from "./components/forms/ArtistForm";
import ArtistPage from "./pages/ArtistPage";
import AlbumForm from "./components/forms/AlbumForm";
import AlbumPage from "./pages/AlbumPage";
import TrackForm from "./components/forms/TrackForm";
import SearchPage from "./pages/SearchPage";

const LoginFormWithRouter = () => {
    const navigate = useNavigate();

    return (
        <LoginForm
            onSuccess={() => {
                window.location.href = "/";
            }}
            switchToRegister={() => navigate("/register")}
        />
    );
};

const RegisterFormWithRouter = () => {
    const navigate = useNavigate();

    return (
        <RegisterForm
            onSuccess={() => {
                window.location.href = "/";
            }}
            switchToLogin={() => navigate("/login")}
        />
    );
};

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginFormWithRouter />} />
            <Route path="/register" element={<RegisterFormWithRouter />} />
            <Route path="/artists">
                <Route path="create" element={<ArtistForm />} />
                <Route path=":artistId" element={<ArtistPage />} />
            </Route>
            <Route path="/artists/edit/:artistId" element={<ArtistForm />} />
            <Route
                path="/artists/:artistId/albums/create"
                element={<AlbumForm />}
            />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="/albums/edit/:albumId" element={<AlbumForm />} />
            <Route path="/tracks/edit/:trackId" element={<TrackForm />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
                path="/albums/:albumId/tracks/create"
                element={<TrackForm />}
            />
        </Routes>
    </BrowserRouter>
);
