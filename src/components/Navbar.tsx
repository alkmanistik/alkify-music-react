import { useEffect, useState } from "react";
import type { UserDTO } from "../models/dto/UserDTO";
import apiClient from "../api/client";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get<UserDTO>("users/me");
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        setUser(null);
        navigate("/");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="bg-black text-white p-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-6">
                {/* Логотип и ссылка на главную */}
                <Link to="/" className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-700 rounded-md flex items-center justify-center mr-2 p-0.5">
                        <img src="/musicIcon.svg" />
                    </div>
                    <span className="font-bold text-xl hidden sm:inline">
                        Alkify
                    </span>
                </Link>
            </div>

            {/* Поисковая строка */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for tracks, artists, albums..."
                        className="w-full bg-gray-800 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Блок авторизации/пользователя */}
            <div className="flex items-center space-x-4">
                {loading ? (
                    <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
                ) : user ? (
                    <div className="flex items-center space-x-3">
                        <Link
                            to={`/profile`}
                            className="flex items-center space-x-2 hover:text-gray-300"
                        >
                            <span className="hidden md:inline">
                                {user.username}
                            </span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="bg-transparent hover:bg-gray-800 px-3 py-1 rounded-md"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
