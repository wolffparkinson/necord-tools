import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On } from "necord";
import { config } from "~/config";

const debugFilters = ["HeartbeatTimer", "Heartbeat acknowledged"];

@Injectable()
export class GatewayLogs {
  private readonly logger = new Logger(GatewayLogs.name);
  private readonly isDev = config.isDev;

  @On("debug")
  debug(@Context() [message]: ContextOf<"debug">) {
    if (!this.isDev) {
      for (const filter of debugFilters) {
        if (message.toLowerCase().includes(filter.toLowerCase())) return;
      }
    }
    this.logger.verbose(message);
  }

  @On("error")
  error(@Context() [error]: ContextOf<"error">) {
    this.logger.error(error);
  }

  @On("warn")
  warn(@Context() [message]: ContextOf<"warn">) {
    this.logger.warn(message);
  }
}
