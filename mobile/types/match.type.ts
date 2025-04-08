import { SportMode } from "./form.type";
import Location from "./location.type";
import { User } from "./user.type";

// interface Match {
//   _id: string;
//   name: string;
//   date: string;
//   location: Location;
//   playersLimit: number;
//   userId: string;
//   users: User[];
// }

export interface Player {
  position: number;
  userId: string | User; // Puede ser el ID o el objeto completo
}

export interface Formations {
  team1: Player[];
  team2: Player[];
}

 interface Match {
  _id?: string;
  name?: string;
  date?: Date;
  dayOfWeek?: number; // 0 = Domingo, 1 = Lunes, etc.
  hour?: number; // 0 a 23
  location?: Location;
  playersLimit?: number;
  userId: string; // Referencia al usuario propietario
  users?: User[]; // Referencias a los usuarios participantes
  sportMode: SportMode;
  open: boolean;
   formations?: Formations;
}
export default Match;

export interface CreateMatchDto {
  name: string;
  date?: Date;
  location?: string;
  playersLimit: number;
  userId: string;
  invitedUsers?: string[] | undefined;
  sportMode: string | undefined;
  open?:boolean
}