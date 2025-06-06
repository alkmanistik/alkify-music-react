import type { AlbumMinimalDTO } from "./AlbumMinimalDTO";
import type { TrackMinimalDTO } from "./TrackMinimalDTO";

export interface ArtistDTO {
    id: number;
    artistName: string;
    imageUrl: string;
    description: string;
    subscriberCount: number;
    albums: Array<AlbumMinimalDTO>;
    tracks: Array<TrackMinimalDTO>;
}
