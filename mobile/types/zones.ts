interface Coordinate {
    coordinates: number[];
}

interface Location {
    type: string;
    coordinates: number[][][];
}

interface Zone {
    name: string;
    location: Location;
}