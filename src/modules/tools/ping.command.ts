import { Injectable } from "@nestjs/common";
import { Client, EmbedBuilder } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { EphemeralOption } from "~/options";
import { isEphemeral, LinesBuilder } from "~/utils";
import { PastelColors } from "~/constants";

@Injectable()
export class PingCommand {
  private readonly latencyColors = [
    [200, PastelColors.Green],
    [500, PastelColors.Yellow],
    [1000, PastelColors.Red],
  ];

  constructor(private readonly client: Client) {}

  @SlashCommand({
    name: "ping",
    description: `Check latency`,
  })
  async onPing(
    @Options() { ephemeralReply }: EphemeralOption,
    @Context() [i]: SlashCommandContext
  ) {
    const ephemeral = isEphemeral({ ephemeralReply });

    const lines = new LinesBuilder().addField(
      `Latency`,
      `${this.client.ws.ping}ms`
    );
    const embed = new EmbedBuilder()
      .setTitle("Pong !")
      .setColor(PastelColors.Dark)
      .setDescription(lines.toString(true));

    const reply = await i.reply({
      fetchReply: true,
      ephemeral,
      embeds: [embed],
    });

    const roundtrip = Date.now() - reply.createdTimestamp;

    return i.editReply({
      embeds: [
        embed
          .setDescription(
            lines.addField(`Roundtrip`, `${roundtrip}ms`).toString(true)
          )
          .setColor(this.getColor(roundtrip / 2)),
      ],
    });
  }

  // Gets color based on latency speed
  private getColor(ms: number) {
    for (const [key, value] of this.latencyColors) {
      if (ms <= key) {
        return value;
      }
    }
    throw new Error(`Invalid latency : ${ms}`);
  }
}
