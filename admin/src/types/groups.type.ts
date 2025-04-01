import { User } from "./users.types";

export interface Group {
  name: string;
  users: string[]; // IDs de usuarios
  userId: string | User; // ID del usuario o el objeto User si viene poblado
  playersLimit: number;
}
