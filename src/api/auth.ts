import type { JwtAuthenticationDTO } from "../models/dto/JwtAuthenticationDTO";
import type { AuthRequest } from "../models/requests/AuthRequest";
import type { UserRequest } from "../models/requests/UserRequest";
import apiClient from "./client";

export const login = async (
    data: AuthRequest
): Promise<JwtAuthenticationDTO> => {
    const response = await apiClient.post<JwtAuthenticationDTO>(
        "/auth/login",
        data
    );
    return response.data;
};

export const register = async (
    data: UserRequest
): Promise<JwtAuthenticationDTO> => {
    const response = await apiClient.post<JwtAuthenticationDTO>(
        "/auth/register",
        data
    );
    return response.data;
};
