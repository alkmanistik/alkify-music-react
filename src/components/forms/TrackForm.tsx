import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import type { TrackRequest } from "../../models/requests/TrackRequest";
import apiClient from "../../api/client";

export default function TrackForm() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();
    const audioInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<TrackRequest>({
        title: "",
        genre: "",
        isExplicit: false,
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioFile) {
            setError("Please select an audio file");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formDataToSend = new FormData();

            // Добавляем JSON с данными трека
            formDataToSend.append(
                "request",
                new Blob([JSON.stringify(formData)], {
                    type: "application/json",
                })
            );

            // Добавляем аудиофайл
            formDataToSend.append("audio", audioFile);

            await apiClient.post(`/tracks/${albumId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate(`../albums/${albumId}`);
        } catch (err) {
            setError("Failed to create track. Please try again.");
            console.error("Error creating track:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                        <h1 className="text-3xl font-extrabold text-white text-center">
                            Add New Track
                        </h1>
                        <p className="text-blue-100 text-center mt-2">
                            Fill in the track details
                        </p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
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

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Genre
                                </label>
                                <input
                                    type="text"
                                    name="genre"
                                    value={formData.genre || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isExplicit"
                                    name="isExplicit"
                                    checked={formData.isExplicit}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="isExplicit"
                                    className="ml-2 block text-gray-700"
                                >
                                    Explicit content
                                </label>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Audio File* (MP3, WAV)
                                </label>
                                <input
                                    type="file"
                                    ref={audioInputRef}
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                    required
                                />
                                {audioFile && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Selected: {audioFile.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70"
                                >
                                    {loading ? (
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
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create Track"
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
