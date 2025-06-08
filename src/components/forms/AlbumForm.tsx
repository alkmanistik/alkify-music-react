import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import type { AlbumRequest } from "../../models/requests/AlbumRequest";
import apiClient from "../../api/client";
import type { AlbumDTO } from "../../models/dto/AlbumDTO";

export default function AlbumForm() {
    const { artistId, albumId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AlbumRequest>({
        title: "",
        description: "",
        tracks: null!,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (albumId) {
            fetchAlbum();
        }
    }, [albumId]);

    const fetchAlbum = async () => {
        try {
            const response = await apiClient.get<AlbumDTO>(
                `/albums/${albumId}`
            );
            const { title, description, imageUrl } = response.data;
            setFormData({
                title,
                description,
                tracks: null!,
            });
            if (imageUrl) {
                setImagePreview(
                    `${import.meta.env.VITE_API_URL}files/images/${imageUrl}`
                );
            }
        } catch (error) {
            setError("Failed to load album data");
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append(
                "request",
                new Blob([JSON.stringify(formData)], {
                    type: "application/json",
                })
            );

            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }

            const url = albumId ? `albums/${albumId}` : `albums/${artistId}`;
            const method = albumId ? "put" : "post";

            await apiClient({
                method,
                url,
                data: formDataToSend,
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate(artistId ? `/artists/${artistId}` : `/albums/${albumId}`);
        } catch (error) {
            setError("Failed to save album");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                        <h1 className="text-3xl font-extrabold text-white text-center">
                            {albumId ? "Edit Album" : "Create New Album"}
                        </h1>
                        <p className="text-blue-100 text-center mt-2">
                            {albumId
                                ? "Update album information"
                                : "Fill in the album details"}
                        </p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Album Cover
                                </label>
                                {imagePreview && (
                                    <div className="mb-4">
                                        <img
                                            src={imagePreview}
                                            alt="Album cover preview"
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Title*
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : albumId ? (
                                        "Update Album"
                                    ) : (
                                        "Create Album"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
