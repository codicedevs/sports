import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { serverSetting } from "./settings";
import { ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./authentication/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "authorization/roles.guard";
import { getProtocolConfig } from "utilities/getProtocolConfig";
import { CountInterceptor } from "interceptors/count.interceptors";

const { key, cert, protocol } = getProtocolConfig();

//CONTAINS IMPLEMENTATION TO BOOTSTRAP THE APPLICATION. THIS IS THE STARTING POINT OF YOUR APPLICATION

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    protocol == "https" ? { httpsOptions: { key, cert } } : undefined,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    exposedHeaders: ["X-Total-Count"], // Exponer el encabezado X-Total-Count
  });
  app.useGlobalGuards(
    new AuthGuard(new JwtService(), new Reflector()),
    new RolesGuard(new Reflector()),
  );
  const countInterceptor = app.get(CountInterceptor);
  app.useGlobalInterceptors(countInterceptor);
  //app.useGlobalFilters(new GlobalExceptionFilter()); // maneja errores de request//pero pisa los dto
  await app.listen(serverSetting.PORT);
  console.log(
    `la app esta corriendo en el puerto ${protocol}${serverSetting.PORT}`,
  );
}
bootstrap();
