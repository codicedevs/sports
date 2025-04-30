// src/service/friendService.ts

import axios from "axios";
import { User } from "../types/user.type";
import Petition from "../types/petition.type";

// --------------------------------------------------
// Hardcodeamos aquí la URL de nuestro backend:
const BASE_URL = "http://192.168.100.18:4002";
// --------------------------------------------------
const api = axios.create({ baseURL: BASE_URL });

/**
 * Llama esto desde tu componente una vez que tengas el token
 */
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export interface PaginatedPetitions {
  results: Petition[];
  totalCount: number;
}

/** Obtener todos los usuarios (para invitar) */
export const fetchUsers = () =>
  api.get<{ results: User[] }>("/users");

export const sendFriendRequest = (userId: string, friendId: string) =>
    api.post(`/users/${userId}/friends/${friendId}`);

/** Ver solicitudes de amistad recibidas */
export const getFriendPetitions = () =>
  api.get<PaginatedPetitions>("/users/friends-petitions");

/** Aceptar una petición concreta */
export const acceptFriendRequest = (petitionId: string) =>
  api.put(`/petitions/accept/${petitionId}`);
