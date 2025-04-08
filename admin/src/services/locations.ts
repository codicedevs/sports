import { Location } from "../types/locations.type";
import { CrudService } from "./crud";

class LocationService extends CrudService<Location> {
  constructor() {
    super("locations");
  }
}

export const locationService = new LocationService();
