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

    const isOwner =
        currentUser?.managedArtists?.some(
            (a) => a.id === album?.artists[0].id
        ) || false;

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!album)
        return (
            <div className="text-center py-10">
                {error || "Album not found"}
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
                            <button
                                onClick={() =>
                                    navigate(`/albums/${albumId}/tracks/create`)
                                }
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Add Track
                            </button>
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
                            {album.tracks.map((track) => (
                                <div
                                    key={track.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-700 rounded transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 w-8 text-right">
                                            {track.id}
                                        </span>
                                        <div>
                                            <h3 className="font-medium text-white">
                                                {track.title}
                                                {track.isExplicit && (
                                                    <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                                                        EXPLICIT
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {formatDuration(
                                                    track.durationSeconds
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <audio
                                        src={track.audioUrl}
                                        controls
                                        className="w-64"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Вспомогательная функция для форматирования длительности
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
