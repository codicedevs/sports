import { CRUDService } from "./CRUD";
import { Activity } from "../types/activity.type";

class ActivityService extends CRUDService<Activity> {
  constructor() {
    super("activity");
  }

   bringMatchActivity = async (matchId:string) => {
    const res = await this.get(`/matches/${matchId}`)
    return res.data
  }
 
}

export default new ActivityService();
