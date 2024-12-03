import Location from "./location.type";
import { User } from "./user.type";

interface Match {
  _id: string;
  name: string;
  date: string;
  location: Location;
  playersLimit: number;
  userId: string;
  users: User[];
}
export default Match;

export interface CreateMatchDto {
  name: string;
  date: string;
  location: string;
  playersLimit: number;
  userId: string;
  invitedUsers?: string[] | undefined;
}