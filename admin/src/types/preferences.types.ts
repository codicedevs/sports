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
