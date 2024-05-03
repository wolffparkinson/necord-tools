import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { ActionRows } from "~/ui";
import { DcRoute, PastelColors } from "~/constants";
import { HELP_CATEGORIES } from "./help.constants";

export class HelpMessage {
  private static readonly categories = HELP_CATEGORIES;

  static build(categoryId?: string) {
    return {
      embeds: this.embeds(),
      components: [this.selectMenu(categoryId), ActionRows.empty()],
    };
  }

  static embeds() {
    return [
      new EmbedBuilder()
        .setTitle("HELP")
        .setColor(PastelColors.Dark)
        .setDescription("Select a help category"),
    ];
  }

  static selectMenu(categoryId?: string) {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setPlaceholder("Select")
        .setCustomId(DcRoute.helpCategories)
        .addOptions(
          this.categories.map((cat) =>
            new StringSelectMenuOptionBuilder()
              .setValue(cat.id)
              .setLabel(cat.label)
              .setDescription(cat.description)
              .setEmoji(cat.emoji)
              .setDefault(cat.id === categoryId)
          )
        )
    );
  }
}
