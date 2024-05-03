import { env } from "./env";
import { necord } from "./necord.config";

export function load() {
  return {
    isDev: env.NODE_ENV === "development",
    necord,
    devGuildId: env.DEV_GUILD_ID,
    devUserId: env.DEV_USER_ID,
  };
}

export const config = load();
