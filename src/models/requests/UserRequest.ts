import type { ArtistRequest } from "./ArtistRequest";

export interface UserRequest {
    username: string;
    email: string;
    password: string;
    managedArtists?: ArtistRequest[];
}
