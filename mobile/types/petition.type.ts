import Location from "./location.type";

interface Emitter {
  name: string;
}

interface Petition {
  _id: string;
  emitter: Emitter;
  receiver: string;
  reference: {
    type: string;
    id: string;
  };
  status: string;
}

export interface PetitionDto {
  emitter: string;
  receiver: string;
  match: string;
  status: string;
}
export interface CreatePetitionDto {
  emitter: string;
  receiver: string;
  match: string;
}

export default Petition;