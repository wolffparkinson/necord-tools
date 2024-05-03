import {
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

export class ActionRows {
  static empty() {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('--empty--')
        .setDisabled(true)
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setValue('--empty--')
            .setLabel('Empty')
        )
    );
  }
}
