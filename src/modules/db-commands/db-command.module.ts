import { Module } from "@nestjs/common";
import { DbCommandService } from "./db-commands.service";

@Module({
  providers: [DbCommandService],
})
export class DbCommandsModule {}
