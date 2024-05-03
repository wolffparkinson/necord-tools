import { Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { PastelColors } from "~/constants";
import { LinesBuilder } from "~/utils";
import { HelpCategory } from "../help.constants";
import { HelpMessage } from "../help.message";

@Injectable()
export class ContactUsMessage {
  build() {
    return {
      embeds: [
        new EmbedBuilder()
          .setTitle("Contact Us")
          .setColor(PastelColors.Dark)
          .setDescription(
            new LinesBuilder()
              .addLines(`Help with bot`, `Feature requests`, `Bugs or issues`)
              .toString(true)
          ),
      ],
      components: [
        HelpMessage.selectMenu(HelpCategory.ContactUs),

        // new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        //   Buttons.support()
        // ),
      ],
    };
  }
}
