import { Location } from "../types/interfaces";
import { CrudService } from "./crud";

class LocationService extends CrudService<Location> {
  constructor() {
    super("locations");
  }
}

export const locationService = new LocationService();
