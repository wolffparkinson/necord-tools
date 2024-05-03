import { z } from "zod";

const validationSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  // Discord
  DISCORD_TOKEN: z.string(),
  DEV_GUILD_ID: z.string(),
  DEV_USER_ID: z.string(),
});

export const env = validationSchema.parse(process.env);
