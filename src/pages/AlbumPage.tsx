import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { UserDTO } from "../models/dto/UserDTO";
import type { AlbumDTO } from "../models/dto/AlbumDTO";
import apiClient from "../api/client";

export default function AlbumPage() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
    const [album, setAlbum] = useState<AlbumDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await apiClient.get<AlbumDTO>(
                    `albums/${albumId}`
                );
                setAlbum(response.data);

                const userResponse = await apiClient.get<UserDTO>("users/me");
                setCurrentUser(userResponse.data);
            } catch (err) {
                setError("Failed to load album data");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [albumId]);

    const handleDeleteAlbum = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this album? This action cannot be undone!"
            )
        ) {
            return;
        }

        setLoading(true);
        try {
            await apiClient.delete(`albums/${albumId}`);
            navigate("/profile"); // Перенаправление после успешного удаления
        } catch (err) {
            setError("Failed to delete album. Please try again.");
            console.error("Album deletion error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTrack = async (trackId: number) => {
        if (!window.confirm("Are you sure you want to delete this track?")) {
            return;
        }

        try {
            await apiClient.delete(`/tracks/${trackId}`);
            // Обновляем список треков после удаления
            const updatedAlbum = { ...album };
            updatedAlbum.tracks = updatedAlbum.tracks!.filter(
                (t) => t.id !== trackId
            );
            setAlbum(updatedAlbum);
        } catch (error) {
            console.error("Failed to delete track:", error);
            alert("Failed to delete track");
        }
    };

    const isOwner =
        currentUser?.managedArtists?.some(
            (a) => a.id === album?.artists[0].id
        ) || false;

    if (loading)
        return (
            <div className="w-full h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex justify-center py-10">
                <h1 className="text-6xl font-bold items-center text-white"></h1>
            </div>
        );
    if (!album)
        return (
            <div className="w-full h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex justify-center py-10">
                <h1 className="text-6xl font-bold items-center text-white">
                    {error || "Album not found"}
                </h1>
            </div>
        );

    return (
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Заголовок альбома и информация */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <img
                            src={
                                album.imageUrl
                                    ? import.meta.env.VITE_API_URL +
                                      "files/images/" +
                                      album.imageUrl
                                    : "/default.jpg"
                            }
                            alt={album.title}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            {album.title}
                        </h1>

                        <div className="flex items-center gap-2 ">
                            {album.artists.map((artist) => (
                                <Link
                                    key={artist.id}
                                    to={`/artists/${artist.id}`}
                                    className="flex items-center gap-2 hover:underline"
                                >
                                    <img
                                        src={
                                            artist.imageUrl
                                                ? import.meta.env.VITE_API_URL +
                                                  "files/images/" +
                                                  artist.imageUrl
                                                : "/default.jpg"
                                        }
                                        alt={artist.artistName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-gray-300">
                                        {artist.artistName}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <p className="text-gray-300 mb-4">
                            {album.description}
                        </p>
                        <p className="text-gray-300">
                            Released: {album.releaseDate}
                        </p>

                        {isOwner && (
                            <div>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/albums/${albumId}/tracks/create`
                                        )
                                    }
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mr-4 rounded"
                                >
                                    Add Track
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(`/albums/edit/${albumId}`)
                                    }
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mr-4 rounded"
                                >
                                    Edit Album
                                </button>
                                <button
                                    onClick={handleDeleteAlbum}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                >
                                    Delete Artist
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Список треков */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Tracks
                    </h2>

                    {album.tracks.length === 0 ? (
                        <p className="text-gray-400 italic">No tracks yet</p>
                    ) : (
                        <div className="space-y-2">
                            {album.tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-700 rounded transition group"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <span className="text-gray-400 w-8 text-right">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white truncate">
                                                {track.title}
                                                {track.isExplicit && (
                                                    <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                                                        EXPLICIT
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <audio
                                            src={`${
                                                import.meta.env.VITE_API_URL
                                            }files/audios/${track.audioUrl}`}
                                            controls
                                            className="w-64"
                                        />

                                        {isOwner && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/tracks/edit/${track.id}`
                                                        )
                                                    }
                                                    className="p-1 text-blue-400 hover:text-blue-300"
                                                    title="Edit track"
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
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteTrack(
                                                            track.id
                                                        )
                                                    }
                                                    className="p-1 text-red-400 hover:text-red-300"
                                                    title="Delete track"
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
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
