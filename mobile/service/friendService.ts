
import axios from "axios";
import { User } from "../types/user.type";
import Petition from "../types/petition.type";

// IP de backend:
const BASE_URL = "http://192.168.1.6:4002";

const api = axios.create({ baseURL: BASE_URL });


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


export const fetchUsers = () =>
  api.get<{ results: User[] }>("/users");

export const sendFriendRequest = (friendId: string) =>{
  api.post(`/users/friends/${friendId}`);}


export const getFriendPetitions = () =>{
  api.get<PaginatedPetitions>("/users/friends-petitions");}


export const acceptFriendRequest = (petitionId: string) =>{
  api.put(`/petitions/accept/${petitionId}`);}
