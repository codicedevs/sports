
export interface Interval {
    startHour: number; 
    endHour: number;
  }
  
 
  export interface Availability {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string;
    endTime: string;
  }
  

  export interface UserPreferences {
    sport?: string; // ID del deporte seleccionado
    sportMode?: string; // ID del modo de deporte seleccionado
    availability?: Availability[]; // Días y horarios disponibles
    preferredZones?: string[]; // Array de IDs de zonas seleccionadas
  }
  