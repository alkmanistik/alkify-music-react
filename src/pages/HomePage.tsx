import { useEffect, useState } from "react";
import apiClient from "../api/client";
import type { ArtistDTO } from "../models/dto/ArtistDTO";
import type { AlbumDTO } from "../models/dto/AlbumDTO";
import type { TrackDTO } from "../models/dto/TrackDTO";
import { Link } from "react-router";

export default function HomePage() {
    const [artists, setArtists] = useState<ArtistDTO[]>([]);
    const [albums, setAlbums] = useState<AlbumDTO[]>([]);
    const [tracks, setTracks] = useState<TrackDTO[]>([]);
    const [loading, setLoading] = useState({
        artists: true,
        albums: true,
        tracks: true,
    });

    useEffect(() => {
        // Загрузка артистов
        apiClient
            .get<ArtistDTO[]>("artists")
            .then((response) => {
                setArtists(response.data);
                setLoading((prev) => ({ ...prev, artists: false }));
            })
            .catch(() => setLoading((prev) => ({ ...prev, artists: false })));

        // Загрузка альбомов
        apiClient
            .get<AlbumDTO[]>("albums")
            .then((response) => {
                setAlbums(response.data);
                setLoading((prev) => ({ ...prev, albums: false }));
            })
            .catch(() => setLoading((prev) => ({ ...prev, albums: false })));

        // Загрузка треков
        apiClient
            .get<TrackDTO[]>("tracks")
            .then((response) => {
                setTracks(response.data);
                setLoading((prev) => ({ ...prev, tracks: false }));
            })
            .catch(() => setLoading((prev) => ({ ...prev, tracks: false })));
    }, []);

    return (
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 min-h-screen px-4 py-6 md:px-8">
            {/* Секция артистов */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Popular Artists
                </h2>
                {loading.artists ? (
                    <div className="flex space-x-6 overflow-x-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-24 animate-pulse"
                            >
                                <div className="rounded-full bg-gray-700 w-24 h-24 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                            {artists.map((artist) => (
                                <Link
                                    to={`/artists/${artist.id}`}
                                    key={artist.id}
                                    className="flex-shrink-0 w-24 text-center group"
                                >
                                    <div className="relative">
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
                                            className="rounded-full w-24 h-24 object-cover group-hover:opacity-80 transition"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-gray-300 group-hover:text-white truncate">
                                        {artist.artistName}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Секция альбомов */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Popular Albums
                </h2>
                {loading.albums ? (
                    <div className="flex space-x-6 overflow-x-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-40 animate-pulse"
                            >
                                <div className="rounded bg-gray-700 w-40 h-40 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                            {albums.map((album) => (
                                <Link
                                    to={`/albums/${album.id}`}
                                    key={album.id}
                                    className="flex-shrink-0 w-40 group"
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
                                        className="rounded w-40 h-40 object-cover group-hover:opacity-80 transition"
                                    />
                                    <div className="mt-2">
                                        <p className="font-medium text-white group-hover:text-indigo-300 truncate">
                                            {album.title}
                                        </p>
                                        <p className="text-sm text-gray-400 truncate">
                                            {album.artists[0].artistName}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Секция треков */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Popular Tracks
                </h2>
                {loading.tracks ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-800 rounded animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                        {tracks.map((track, index) => (
                            <div
                                key={track.id}
                                className="flex items-center p-3 hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
                            >
                                <img
                                    src={
                                        track.album.imageUrl
                                            ? import.meta.env.VITE_API_URL +
                                              "files/images/" +
                                              track.album.imageUrl
                                            : "/default.jpg"
                                    }
                                    alt={track.album.title}
                                    className="rounded w-16 h-16 object-cover group-hover:opacity-80 transition"
                                />
                                <div className="text-gray-400 w-8 text-center">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0 ml-4">
                                    <p className="font-medium text-white truncate">
                                        {track.title}
                                    </p>
                                    <p className="text-sm text-gray-400 truncate">
                                        {track.artists[0].artistName} •{" "}
                                        {track.album?.title}
                                    </p>
                                </div>
                                {/* <div className="text-gray-400 text-sm">
                                    {formatDuration(track.durationSeconds)}
                                </div> */}
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
                )}
            </section>
        </div>
    );
}

// Вспомогательная функция для форматирования времени
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
