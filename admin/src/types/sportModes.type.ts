export interface SportMode {
  _id: string;
  name: string;
  sport: string;
  __v: number;
  label: string;
}

export interface SportModeDto {
  name: string;
  sport: string; // ID del Sport (ObjectId en string)
  label?: string;
}
