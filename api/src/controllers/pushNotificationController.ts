import { Controller, Post, Body } from "@nestjs/common";
import { PushNotificationService } from "services/pushNotificationservice";

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
