import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { UserDTO } from "../models/dto/UserDTO";
import type { ArtistDTO } from "../models/dto/ArtistDTO";
import apiClient from "../api/client";

export default function ArtistPage() {
    const { artistId } = useParams<{ artistId: string }>();
    const navigate = useNavigate();
    const [artist, setArtist] = useState<ArtistDTO | null>(null);
    const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Проверяем, является ли текущий пользователь владельцем артиста
    const isOwner =
        currentUser?.managedArtists?.some((a) => a.id === artist?.id) || false;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Загружаем данные артиста
                const artistResponse = await apiClient.get<ArtistDTO>(
                    `artists/${artistId}`
                );
                setArtist(artistResponse.data);

                // Загружаем данные текущего пользователя
                const userResponse = await apiClient.get<UserDTO>("users/me");
                setCurrentUser(userResponse.data);
            } catch (err) {
                setError("Failed to load artist data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistId]);

    const handleEditArtist = () => {
        navigate(`/artists/edit/${artistId}`);
    };

    const handleCreateAlbum = () => {
        navigate(`/artists/${artistId}/albums/create`);
    };

    const handleDeleteArtist = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this artist? This action cannot be undone!"
            )
        ) {
            return;
        }

        setLoading(true);
        try {
            await apiClient.delete(`artists/${artistId}`);
            navigate("/profile"); // Перенаправление после успешного удаления
        } catch (err) {
            setError("Failed to delete artist. Please try again.");
            console.error("Artist deletion error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="w-full h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex justify-center py-10">
                <h1 className="text-6xl font-bold items-center text-white"></h1>
            </div>
        );
    if (!artist)
        return (
            <div className="w-full h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex justify-center py-10">
                <h1 className="text-6xl font-bold items-center text-white">
                    Artist not found
                </h1>
            </div>
        );

    return (
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Хедер артиста */}
                <div className="relative mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
                            <img
                                src={
                                    artist.imageUrl
                                        ? import.meta.env.VITE_API_URL +
                                          "files/images/" +
                                          artist.imageUrl
                                        : "/default.jpg"
                                }
                                alt={artist.artistName}
                                className="rounded-full w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                                        {artist.artistName}
                                    </h1>
                                    {/* <p className="text-gray-400 mt-2">
                                        {artist.subscriberCount} subscribers
                                    </p> */}
                                </div>

                                {isOwner && (
                                    <div>
                                        <button
                                            onClick={handleEditArtist}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mr-4 rounded"
                                        >
                                            Edit Artist
                                        </button>
                                        <button
                                            onClick={handleDeleteArtist}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                        >
                                            Delete Artist
                                        </button>
                                    </div>
                                )}
                            </div>

                            {artist.description && (
                                <p className="text-gray-300 mt-4 max-w-3xl">
                                    {artist.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Альбомы */}
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">
                            Albums
                        </h2>
                        {isOwner && (
                            <button
                                onClick={handleCreateAlbum}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                            >
                                <span className="mr-2">+</span> Create Album
                            </button>
                        )}
                    </div>

                    {artist.albums.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {artist.albums.map((album) => (
                                <div
                                    key={album.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition cursor-pointer"
                                    onClick={() =>
                                        navigate(`/albums/${album.id}`)
                                    }
                                >
                                    <img
                                        src={
                                            album.imageUrl
                                                ? import.meta.env.VITE_API_URL +
                                                  "files/images/" +
                                                  album.imageUrl
                                                : "/default.jpg"
                                        }
                                        alt={album.title}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="font-medium text-white truncate">
                                            {album.title}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {album.releaseDate}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-lg p-8 text-center">
                            <p className="text-gray-400">No albums yet</p>
                            {isOwner && (
                                <button
                                    onClick={handleCreateAlbum}
                                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                >
                                    Create First Album
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Треки */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Popular Tracks
                    </h2>

                    {artist.tracks.length > 0 ? (
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            {artist.tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="flex items-center p-3 hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
                                    // onClick={() =>
                                    //     navigate(`/tracks/${track.id}`)
                                    // }
                                >
                                    <div className="text-gray-400 w-8 text-center">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 ml-4">
                                        <p className="font-medium text-white truncate">
                                            {track.title}
                                        </p>
                                        <p className="text-sm text-gray-400 truncate">
                                            {/* {track.albums?.title || 'Single'} */}
                                        </p>
                                    </div>
                                    <audio
                                        src={
                                            import.meta.env.VITE_API_URL +
                                            "files/audios/" +
                                            track.audioUrl
                                        }
                                        controls
                                        className="w-64"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-lg p-8 text-center">
                            <p className="text-gray-400">No tracks yet</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
