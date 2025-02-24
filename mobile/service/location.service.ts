import Location from "../types/location.type";
import { CRUDService } from "./CRUD";

class LocationService extends CRUDService<Location> {
  constructor() {
    super("locations");
  }

};

export default new LocationService();