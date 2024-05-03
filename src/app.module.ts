import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { NecordModule } from "necord";
import { ConfigModule, config } from "./config";
import { GlobalDiscordFilter } from "./filters";
import { InteractionLogger } from "./interceptors";
import * as modules from "./modules";
import { DiscordClientUtilsModule } from "./providers";

@Module({
  imports: [
    ConfigModule,
    NecordModule.forRoot(config.necord),
    DiscordClientUtilsModule,
    ...Object.values(modules),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalDiscordFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InteractionLogger,
    },
  ],
})
export class AppModule {}
