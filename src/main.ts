import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
  return app;
}

(async (): Promise<void> => {
  try {
    await bootstrap();
    Logger.log(
      `Discord
    - NODE_ENV : ${process.env.NODE_ENV}`
    );
  } catch (error) {
    console.error(error);
    Logger.error(error);
  }
})();
