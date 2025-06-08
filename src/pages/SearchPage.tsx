import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { useLocation } from "react-router";
import type { ArtistDTO } from "../models/dto/ArtistDTO";
import type { AlbumDTO } from "../models/dto/AlbumDTO";
import type { TrackDTO } from "../models/dto/TrackDTO";

export default function SearchPage() {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("q") || "";

    const [artists, setArtists] = useState<ArtistDTO[]>([]);
    const [albums, setAlbums] = useState<AlbumDTO[]>([]);
    const [tracks, setTracks] = useState<TrackDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery.trim()) {
                setArtists([]);
                setAlbums([]);
                setTracks([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                // Параллельные запросы для всех типов данных
                const [artistsRes, albumsRes, tracksRes] = await Promise.all([
                    apiClient.get<ArtistDTO[]>(
                        `/artists/search?name=${encodeURIComponent(
                            searchQuery
                        )}`
                    ),
                    apiClient.get<AlbumDTO[]>(
                        `/albums/search?title=${encodeURIComponent(
                            searchQuery
                        )}`
                    ),
                    apiClient.get<TrackDTO[]>(
                        `/tracks/search?title=${encodeURIComponent(
                            searchQuery
                        )}`
                    ),
                ]);

                setArtists(artistsRes.data);
                setAlbums(albumsRes.data);
                setTracks(tracksRes.data);
            } catch (err) {
                setError("Failed to load search results");
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 px-4 py-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-6">
                        Searching...
                    </h1>
                    <div className="space-y-10">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-8 w-1/3 bg-gray-700 rounded mb-4"></div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {[...Array(5)].map((_, j) => (
                                        <div
                                            key={j}
                                            className="bg-gray-800 rounded-lg h-40"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const hasResults =
        artists.length > 0 || albums.length > 0 || tracks.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 px-4 py-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Search results for: "{searchQuery}"
                </h1>

                {!hasResults && (
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <p className="text-gray-400 text-xl">
                            No results found
                        </p>
                        <p className="text-gray-500 mt-2">
                            Try different search terms
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-10">
                    {/* Секция артистов */}
                    {artists.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Artists
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {artists.map((artist) => (
                                    <div
                                        key={artist.id}
                                        className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/artists/${artist.id}`)
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
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="p-3">
                                            <h3 className="font-medium text-white truncate">
                                                {artist.artistName}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Секция альбомов */}
                    {albums.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Albums
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {albums.map((album) => (
                                    <div
                                        key={album.id}
                                        className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/albums/${album.id}`)
                                        }
                                    >
                                        <img
                                            src={
                                                album.imageUrl
                                                    ? import.meta.env
                                                          .VITE_API_URL +
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
                                            <p className="text-sm text-gray-400 truncate">
                                                {album.artists[0]?.artistName ||
                                                    "Various artists"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Секция треков */}
                    {tracks.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Tracks
                            </h2>
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                {tracks.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center p-3 hover:bg-gray-700 transition border-b border-gray-700 last:border-0 cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/tracks/${track.id}`)
                                        }
                                    >
                                        <div className="text-gray-400 w-8 text-center">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0 ml-4">
                                            <p className="font-medium text-white truncate">
                                                {track.title}
                                                {track.isExplicit && (
                                                    <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                                                        EXPLICIT
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-400 truncate">
                                                {track.artists[0]?.artistName ||
                                                    "Unknown artist"}{" "}
                                                •
                                                {track.album?.title || "Single"}
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
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
