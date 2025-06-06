import type { AlbumMinimalDTO } from "./AlbumMinimalDTO";
import type { ArtistMinimalDTO } from "./ArtistMinimalDTO";

export interface TrackDTO {
    id: number;
    title: string;
    genre: string;
    durationSeconds: number;
    audioUrl: string;
    releaseDate: number;
    artists: Array<ArtistMinimalDTO>;
    album: AlbumMinimalDTO;
    isExplicit: boolean;
    likeCount: number;
}
