import { Zone } from "../types/zone.type";
import { CrudService } from "./crud";

class ZoneService extends CrudService<Zone> {
  constructor() {
    super("zones");
  }
}

export const zoneService = new ZoneService();
