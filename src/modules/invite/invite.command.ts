import { Injectable } from "@nestjs/common";
import { CommandInteraction } from "discord.js";
import { Context, Options, SlashCommand } from "necord";
import { EphemeralOption } from "~/options";
import { UrlProvider } from "~/providers";
import { isEphemeral } from "~/utils";

@Injectable()
export class InviteCommand {
  constructor(private readonly urls: UrlProvider) {}

  @SlashCommand({
    name: "invite",
    description: "Invite link",
  })
  onSlash(
    @Options() { ephemeralReply }: EphemeralOption,
    @Context() [interaction]: [CommandInteraction]
  ) {
    const ephemeral = isEphemeral({ ephemeralReply });

    return interaction.reply({
      ephemeral,
      content: this.urls.botInvite(),
    });
  }
}
