import { useEffect, useState } from "react";
import type { UserDTO } from "../models/dto/UserDTO";
import type { UserRequest } from "../models/requests/UserRequest";
import { useNavigate } from "react-router";
import apiClient from "../api/client";

export default function ProfilePage() {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<UserRequest>({
        username: "",
        email: "",
        password: "",
        managedArtists: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get<UserDTO>("/users/me");
                console.log(response);
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    password: "",
                    managedArtists: [],
                });
            } catch (error) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.put<UserDTO>("users/", formData);
            setUser(response.data);
            setEditing(false);
            setError("");
        } catch (error) {
            setError("Failed to update profile");
        }
    };

    const handleCreateArtist = () => {
        navigate("/artists/create");
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!user) return <div className="text-center py-10">User not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Левая часть - профиль */}
                    <div className="md:w-1/3">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex flex-col items-center">
                                {/* Аватарка (у всех одинаковая) */}
                                <div className="w-29 h-29 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
                                    <span className="text-4xl font-bold text-white">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                {editing ? (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="w-full space-y-4"
                                    >
                                        <div>
                                            <label className="block text-gray-300 mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-1">
                                                New Password (leave empty to
                                                keep current)
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        </div>

                                        {error && (
                                            <div className="text-red-500">
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditing(false)
                                                }
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-white">
                                            {user.username}
                                        </h2>
                                        <p className="text-gray-400">
                                            {user.email}
                                        </p>

                                        <button
                                            onClick={() => setEditing(true)}
                                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                        >
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Правая часть - артисты */}
                    <div className="md:w-2/3">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    My Artists
                                </h2>
                                <button
                                    onClick={handleCreateArtist}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                                >
                                    <span className="mr-2">+</span> Create
                                    Artist
                                </button>
                            </div>

                            {user.managedArtists?.length ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {user.managedArtists.map((artist) => (
                                        <div
                                            key={artist.id}
                                            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/artists/${artist.id}`
                                                )
                                            }
                                        >
                                            <img
                                                src={
                                                    artist.imageUrl
                                                        ? import.meta.env
                                                              .VITE_API_URL +
                                                          "files/images/" +
                                                          artist.imageUrl
                                                        : "/default.jpg"
                                                }
                                                alt={artist.artistName}
                                                className="rounded-full object-cover group-hover:opacity-80 transition"
                                            />
                                            <h3 className="text-white font-medium text-center truncate">
                                                {artist.artistName}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    You don't have any artists yet. Click
                                    "Create Artist" to get started!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
