import type { ArtistDTO } from "./ArtistDTO";

export interface UserDTO {
    id: number;
    username: string;
    email: string;
    managedArtists: Array<ArtistDTO>;
}
