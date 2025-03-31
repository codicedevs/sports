import { Location } from "../interfaces/interfaces";
import { CrudService } from "./crud";

class LocationService extends CrudService<Location> {
  constructor() {
    super("locations");
  }
}

export const locationService = new LocationService();
