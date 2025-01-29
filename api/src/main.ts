import "./instrument";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { serverSetting } from "./settings";
import { ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./authentication/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "authorization/roles.guard";
import { getProtocolConfig } from "utilities/getProtocolConfig";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const { key, cert, protocol } = getProtocolConfig();

//CONTAINS IMPLEMENTATION TO BOOTSTRAP THE APPLICATION. THIS IS THE STARTING POINT OF YOUR APPLICATION

async function bootstrap() {
  process.env.TZ = "America/Argentina/Buenos_Aires";
  const app = await NestFactory.create(
      AppModule,
      protocol == "https" ? { httpsOptions: { key, cert } } : undefined
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, //antes estaba en true
      forbidNonWhitelisted: false, //antes estaba en true
    }),
  );
  app.enableCors();
  app.useGlobalGuards(
    new AuthGuard(new JwtService(), new Reflector()),
    new RolesGuard(new Reflector()),
  );
  const config = new DocumentBuilder()
    .setTitle("Furbo")
    .setDescription("Api")
    .setVersion("1.0")
    .addTag("furbo")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("explorer", app, documentFactory);
  //app.useGlobalFilters(new GlobalExceptionFilter()); // maneja errores de request//pero pisa los dto
  await app.listen(serverSetting.PORT);
  //console.log(`la app esta corriendo en el puerto ${protocol}${serverSetting.PORT}`);
  console.log(
    `la app esta corriendo en el puerto ${protocol} ${serverSetting.PORT}`,
  );
}
bootstrap();
