
export interface Interval {
    startHour: number; 
    endHour: number;
  }
  
 
  export interface Availability {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    intervals: Interval[]; 
  }
  

  export interface UserPreferences {
    sport?: string; // ID del deporte seleccionado
    sportMode?: string; // ID del modo de deporte seleccionado
    availability?: Availability[]; // Días y horarios disponibles
    preferredZones?: string[]; // Array de IDs de zonas seleccionadas
  }
  