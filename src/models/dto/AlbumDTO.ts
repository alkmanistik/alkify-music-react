import type { ArtistMinimalDTO } from "./ArtistMinimalDTO";
import type { TrackMinimalDTO } from "./TrackMinimalDTO";

export interface AlbumDTO {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    releaseDate: number;
    artists: Array<ArtistMinimalDTO>;
    tracks: Array<TrackMinimalDTO>;
}
