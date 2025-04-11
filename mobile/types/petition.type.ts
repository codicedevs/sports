// petition.type.ts


export enum PetitionModelType {
  Match = "Match",
  Group = "Group",
}

interface Emitter {
  name: string;
}

// Definición de la interfaz para la información del partido
interface MatchReference {
  _id: string;
  date: string;
  hour: number;
  name: string;
  // Agrega otras propiedades según la respuesta de tu API
}

interface Petition {
  _id: string;
  emitter: Emitter;
  receiver: string;
  reference: {
    type: string;
    id: MatchReference; // Ahora id es un objeto de tipo MatchReference
  };
  status: string;
}

export interface PetitionDto {
  emitter: string;
  receiver: string;
  reference: {
    type: PetitionModelType;
    id: string;
  }
}

export interface CreatePetitionDto {
  emitter: string;
  receiver: string;
  match: string;
}

export default Petition;
