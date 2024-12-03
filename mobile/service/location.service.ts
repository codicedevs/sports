import { HttpService } from "./http.service";
import Location from "../types/location.type";

class LocationService extends HttpService {
  constructor() {
    super("locations");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res.data;
  };

  create = async (location: Location) => {
    const res = await this.post(`/`, { location });
    return res.data;
  };
}

export default new LocationService();