import { ApplicationCommandOptionType } from "discord.js";
import { OptionMeta } from "necord";

export const db = {
  async findAll(): Promise<DbSlashCommand[]> {
    return [
      {
        id: "slash_1",
        name: "db-command-1",
        description: "This is a slash command saved in database",
        options: [
          {
            name: "message",
            description: "Type a message",
            type: ApplicationCommandOptionType.String,
            resolver: "getString",
            required: true,
          },
        ],
      },
    ];
  },
};

export interface DbSlashCommand {
  id: string;
  name: string;
  description: string;
  options: OptionMeta[];
}
