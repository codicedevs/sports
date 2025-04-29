import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
type ExtendedExpoPushMessage = ExpoPushMessage & { _contentAvailable?: boolean };
@Injectable()
export class PushNotificationService {
  private expo: Expo;
  private logger = new Logger(PushNotificationService.name);

  constructor() {
    this.expo = new Expo();
  }

  async sendPushNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: any,
  ) {
    const messages: ExpoPushMessage[] = [];
    
    for (let pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        this.logger.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
        _contentAvailable: true,
      }as ExtendedExpoPushMessage);
    }

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        this.logger.error(error);
      }
    }
    
    return tickets;
  }
}
