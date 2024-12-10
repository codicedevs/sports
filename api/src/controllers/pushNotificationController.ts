import { Controller, Post, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PushNotificationService } from "services/pushNotificationservice";

@ApiBearerAuth()
@ApiTags('notifications')
@Controller("notifications")
export class EventsController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post("send")
  async sendNotification(
    @Body()
    sendNotificationDto: {
      tokens: string[];
      title: string;
      body: string;
    },
  ) {
    const { tokens, title, body } = sendNotificationDto;
    return this.pushNotificationService.sendPushNotification(
      tokens,
      title,
      body,
    );
  }
}
