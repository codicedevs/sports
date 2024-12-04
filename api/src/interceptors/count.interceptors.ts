import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { User } from "user/user.entity";
import { Match } from "match/match.entity";
import { Location } from "locations/location.entity";

@Injectable()
export class CountInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.method === "GET") {
      const entityName = this.getEntityNameFromRequest(request);

      if (entityName) {
        try {
          const model = this.getModelByEntityName(entityName);
          const count = await model.countDocuments();
          const range = `0-${count - 1}/${count}`;
          response.setHeader("Content-Range", `${entityName} ${range}`);
          response.setHeader("X-Total-Count", count.toString());
        } catch (err) {
          console.error(err);
        }
      }
    }
    return next.handle();
  }

  private getEntityNameFromRequest(req: Request): string | null {
    const path = req.path;

    const entityMap: { [key: string]: string } = {
      "/users": "User",
      "/matches": "Match",
      "/locations": "Location",
    };

    return entityMap[path] || null;
  }

  private getModelByEntityName(entityName: string): Model<any> {
    switch (entityName) {
      case "User":
        return this.userModel;
      case "Match":
        return this.matchModel;
      case "Location":
        return this.locationModel;
      default:
        throw new Error("Unknown entity");
    }
  }
}
