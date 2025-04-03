import { Group } from "./groups.type";
import { User } from "./users.types";

export interface Match {
  _id: string;
  open: boolean;
  name: string;
  date: string; // Puedes cambiar a Date si conviertes el string
  location: Location;
  playersLimit: number;
  userId: string;
  users: string[]; // Arreglo de _id_ de usuarios
  __v: number;
  user: User;
  groups: Group[];
}

export interface MatchList {
  _id: string;
  name: string;
  date: string; // o Date, según cómo lo manejes internamente
  location: Location | null;
  user: User | null;
  open: boolean;
}

export interface newMatchDto {
  name: string;
  date: string;
  location: string;
  playersLimit: number;
}
