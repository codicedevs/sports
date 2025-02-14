import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MatchUpdatedEvent } from "app-events.ts/match.events";
import { Match } from "match/match.entity";
import { MatchService } from "match/match.service";
import { HydratedDocument } from "mongoose";
import { PushNotificationService } from "services/pushNotificationservice";
import { UserService } from "user/user.service";

@Injectable()
export class MatchListener {
  private readonly logger = new Logger(MatchListener.name);

  constructor(
    private readonly matchService: MatchService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @OnEvent("match.updated", { async: true })
  async handleMatchUpdated(event: MatchUpdatedEvent) {
    const match: HydratedDocument<Match> = event.match;

    if (!match.open) return;

    this.logger.log(`Processing match update for match ID`);

    const eligibleUsers =
      await this.matchService.getUsersForMatchRecommendations(match);

    const tokens = eligibleUsers
      .map((user) => user.pushToken)
      .filter((token) => !!token);

    if (tokens.length > 0) {
      await this.pushNotificationService.sendPushNotification(
        tokens,
        "¡Nuevo partido disponible!",
        `Un partido está abierto. ¡Únete ahora!`,
        { matchId: match.id },
      );
    }
  }

  @OnEvent("player.added", { async: true })
  async handlePlayersleftAdd(event: MatchUpdatedEvent) {
    const match = event.match;
    await this.matchService.update(match.id, {
      playersLeft: match.playersLeft - 1,
    });
  }
  @OnEvent("player.removed", { async: true })
  async handlePlayersleftRemoved(event: MatchUpdatedEvent) {
    const match = event.match;
    await this.matchService.update(match.id, {
      playersLeft: match.playersLeft + 1,
    });
  }
}
