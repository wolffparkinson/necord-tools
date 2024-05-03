import { SlashCommand, SlashCommandMeta } from "necord";
import { config } from "~/config";

export const AdminCommand = (
  opts: Pick<
    SlashCommandMeta,
    | "name"
    | "description"
    | "descriptionLocalizations"
    | "nameLocalizations"
    | "nsfw"
  >
) =>
  SlashCommand({
    defaultMemberPermissions: ["ManageGuild"],
    // TODO: Deprecate dmPermission in favour of contexts
    // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
    dmPermission: false,
    guilds: [config.devGuildId],
    ...opts,
  });
