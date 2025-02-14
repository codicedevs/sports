export interface Sport {
    name: string,
    _id: string
}

export interface SportMode {
    name: string;
    _id: string;
    label: string
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
    privacyOption: PrivacyOption;
    matchDate: Date | null;
    location: Place | null;
}