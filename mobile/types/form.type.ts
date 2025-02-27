export interface Sport {
    name: string,
    _id: string
}

export interface SportMode {
    name: string;
    _id: string;
    label: string;
    sport: string
}

export type PrivacyOption = 'public' | 'private';

interface Location {
    type: "Point";
    coordinates: [number, number];
}

export interface Place {
    _id: string;
    name: string;
    address: string;
    location: Location;
    matches: any[];
}

export interface MatchDetails {
    selectedSport: Sport | null;
    selectedSportMode: SportMode | null;
    playerLimit: number;
    privacyOption: boolean;
    matchDate: Date | undefined;
    location: Place | null;
}

export interface Zone {
    _id?: string;
    name: string;
    location: {
        type: "Polygon";
        coordinates: number[][][];
    };
}

interface Interval {
    startHour: number;
    endHour: number;
}

interface Availability {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    intervals: Interval[];
}


export interface Profile {
    availability: Availability[] | null;
    preferredZones?: (string | Zone)[] | null;
    preferredSports?: (string | Sport)[] | null;
    preferredSportModes?: (string | SportMode)[] | null;
}