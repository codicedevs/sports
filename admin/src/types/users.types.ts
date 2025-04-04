import { Profile } from "./preferences.types";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  friends: string[]; // Asumimos que son referencias por _id
  roles: string[];
  matches: string[]; // Asumimos que son referencias por _id
  __v: number;
  profile: Profile;
}

export interface UserList {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  calificacion: string;
}

export interface NewUserDto {
  name: string;
  email: string;
  phone: string;
  password?: string;
}
