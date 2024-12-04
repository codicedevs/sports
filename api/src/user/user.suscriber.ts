import { Injectable } from "@nestjs/common";
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { EmailService } from "../email/email.service";
import { User } from "./user.entity";

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }
  async afterInsert(event: InsertEvent<User>): Promise<void> {
    const { entity } = event;
    try {
      await new EmailService().sendUserRegistration(entity);
    } catch (error) {
      console.error('Error sending email:', error);
    }
    console.log('Entity inserted:', entity);
  }
}
