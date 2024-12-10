import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'authentication/public';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get("/debug-sentry")
	getError() {
		throw new Error("My first Sentry error!");
	}
}
