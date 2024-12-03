export interface Location {
    _id: string;
    name: string;
    address: string;
    location: {
      type: string;
      coordinates: number[];
    };
    matches?: string[];
  }
  
  export default Location;