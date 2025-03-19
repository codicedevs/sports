import { CRUDService } from "./CRUD";
import { Event } from "../types/event.type";

class EventService extends CRUDService<Event> {
  constructor() {
    super("events");
  }

  getAllFiltered = async (filter?: any) => {
    if (filter && Object.keys(filter).length > 0) {
      const res = await this.get("/", { params: filter });
      return res;
    } else {
      const res = await this.get("/");
      return res;
    }
  };
}

export default new EventService();
