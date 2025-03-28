export interface Interval {
  startHour: number;
  endHour: number;
}

export interface Availability {
  day: string;
  intervals: Interval[];
}

export interface Profile {
  availability: Availability[];
  preferredZones: string[];
  preferredSports: string[];
  preferredSportModes: string[];
  _id: string;
}

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
  password: string;
}

export interface GeoLocation {
  type: string;
  coordinates: [number, number];
}

export interface Location {
  location: GeoLocation;
  _id: string;
  name: string;
  address: string;
  __v: number;
  matches: Match[]; // Nota: esto crea una relación circular con Match.
}

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

export interface Group {
  name: string;
  users: string[]; // IDs de usuarios
  userId: string | User; // ID del usuario o el objeto User si viene poblado
  playersLimit: number;
}

type FilterOperator<T> = T | { LIKE: string };

export type Filter<T> = {
  [P in keyof T]?: FilterOperator<T[P]>;
};

export interface SportMode {
  _id: string;
  name: string;
  sport: string;
  __v: number;
  label: string;
}
