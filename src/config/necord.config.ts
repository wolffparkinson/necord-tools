import { Partials } from "discord.js";
import { NecordModuleOptions } from "necord";
import { env } from "./env";

export const necord: NecordModuleOptions = {
  token: env.DISCORD_TOKEN,
  shards: "auto",
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
  partials: [Partials.Channel],
  ws: { version: 10 },
  development: env.NODE_ENV !== "production" ? [env.DEV_GUILD_ID] : false,
};
