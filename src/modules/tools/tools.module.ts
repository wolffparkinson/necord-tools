import { Module } from "@nestjs/common";

import { PingCommand } from "./ping.command";
import { StatsCommand } from "./stats.command";
import { TimestampCommand } from "./time";

@Module({
  providers: [PingCommand, StatsCommand, TimestampCommand],
})
export class ToolsModule {}
