import type { TrackRequest } from "./TrackRequest";

export interface AlbumRequest {
    title: string;
    description?: string;
    tracks?: TrackRequest[];
}
