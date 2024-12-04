import { ValidationPipe } from "@nestjs/common";

export const QueryValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidNonWhitelisted: true,
  whitelist: true,
});
