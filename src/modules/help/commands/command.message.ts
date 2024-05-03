import { Injectable } from "@nestjs/common";
import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  formatEmoji,
  inlineCode,
} from "discord.js";
import { HelpCategory } from "../help.constants";
import { HelpMessage } from "../help.message";
import { COMMAND_CATEGORIES } from "./commands.constants";
import { SlashProvider } from "~/providers";
import { DcRoute, PastelColors } from "~/constants";
import { LinesBuilder } from "~/utils";

@Injectable()
export class CommandsMessage {
  private readonly assignedCommands = Array.from(
    new Set(COMMAND_CATEGORIES.map((c) => c.commands).flat())
  );

  private readonly OTHERS_CATEGORY = "others";

  constructor(private readonly slash: SlashProvider) {}

  build(selected?: string) {
    return {
      embeds: selected ? [this.categoryEmbed(selected)] : [this.introEmbed()],
      components: [
        HelpMessage.selectMenu(HelpCategory.Commands),
        this.selectCategory(selected),
      ],
    };
  }

  introEmbed() {
    return new EmbedBuilder()
      .setTitle("COMMANDS")
      .setColor(PastelColors.Dark)
      .setDescription(`Select a command category to list commands`);
  }

  categoryEmbed(selected: string) {
    let categoryLabel;
    const commandNames: string[] = [];

    const all = this.slash.getAll();
    const category = COMMAND_CATEGORIES.find((c) => c.id === selected);

    if (category) {
      commandNames.push(...category.commands);
      categoryLabel = category.label;
    } else if (selected === this.OTHERS_CATEGORY) {
      categoryLabel = `Other Commands`;
      commandNames.push(
        ...this.getOtherCommands()
          .toJSON()
          .flatMap((c) => c.name)
      );
    } else {
      throw new Error(`Command category not found : ${selected}`);
    }

    return new EmbedBuilder()
      .setTitle(categoryLabel)
      .setColor(PastelColors.Dark)
      .setDescription(
        new LinesBuilder({ bulleted: true })
          .addFields(
            ...commandNames.map((name) => {
              const command = all.find((cmd) => cmd.name === name);
              return {
                key: command ? this.slash.mention(name) : `/${name}`,
                value: command?.description ?? inlineCode("N/A"),
              };
            })
          )
          .toString()
      );
  }

  selectCategory(selected?: string) {
    const menu = new StringSelectMenuBuilder()
      .setPlaceholder("Select a command category")
      .setCustomId(DcRoute.helpCategory(HelpCategory.Commands))
      .addOptions(
        COMMAND_CATEGORIES.map((c) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(c.label)
            .setValue(c.id)
            .setDescription(c.description)
            .setEmoji(c.emoji)
            .setDefault(selected === c.id)
        )
      );

    const others = this.getOtherCommands();
    if (others.size) {
      menu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Others")
          .setValue(this.OTHERS_CATEGORY)
          .setDefault(selected === this.OTHERS_CATEGORY)
          .setEmoji("#️⃣")
      );
    }

    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      menu
    );
  }

  private getOtherCommands() {
    return this.slash
      .getAll()
      .filter((c) => !this.assignedCommands.includes(c.name));
  }
}
