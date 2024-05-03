import { Injectable } from "@nestjs/common";
import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { SlashProvider } from "~/providers";
import { LinesBuilder } from "~/utils";
import { HelpCategory } from "../help.constants";
import { HelpMessage } from "../help.message";
import { DcRoute, PastelColors } from "~/constants";

@Injectable()
export class FAQsMessage {
  constructor(private readonly slash: SlashProvider) {}

  faqs() {
    return [this.howToInvite()];
  }

  build(selected?: string) {
    const idx = selected ? parseInt(selected) : undefined;
    return {
      embeds:
        typeof idx === "number" ? this.faqs()[idx].embeds : [this.introEmbed()],
      components: [
        HelpMessage.selectMenu(HelpCategory.FAQs),
        this.selectFAQ(idx),
      ],
    };
  }

  introEmbed() {
    return new EmbedBuilder()
      .setTitle("Frequently Asked Questions")
      .setColor(PastelColors.Dark);
  }

  selectFAQ(selected?: number) {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setPlaceholder("Select")
        .setCustomId(DcRoute.helpCategory(HelpCategory.FAQs))
        .addOptions(
          this.faqs().map((f, idx) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(f.label)
              .setValue(idx.toString())
              .setDescription(f.description)
              .setEmoji(f.emoji)
              .setDefault(selected === idx)
          )
        )
    );
  }

  private howToInvite() {
    const description = "How to invite bot to my server";
    return {
      emoji: "🤖",
      label: "Invite",
      description,
      embeds: [
        new EmbedBuilder()
          .setColor(PastelColors.Dark)
          .setTitle(`Q. ${description} ?`)
          .setDescription(
            new LinesBuilder({ bulleted: false })
              .addLine(
                `${this.slash.mention("invite")} command to view invite link`
              )
              .toString(true)
          ),
      ],
    };
  }
}
