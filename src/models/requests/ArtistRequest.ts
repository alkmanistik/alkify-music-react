import type { AlbumRequest } from "./AlbumRequest";

export interface ArtistRequest {
    artistName: string;
    description?: string;
    albums?: AlbumRequest[];
}
