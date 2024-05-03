import { Injectable, Logger } from "@nestjs/common";
import {
  ComponentParam,
  Context,
  Options,
  SelectedStrings,
  SlashCommand,
  SlashCommandContext,
  StringSelect,
  StringSelectContext,
} from "necord";
import { isEphemeral } from "~/utils";
import { DcRoute } from "~/constants";
import { CommandsMessage } from "./commands";
import { ContactUsMessage } from "./contact-us";
import { FAQsMessage } from "./faqs";
import { HelpCategory } from "./help.constants";
import { HelpMessage } from "./help.message";
import { HelpCommandOptions } from "./help.options";

@Injectable()
export class HelpCommand {
  private readonly logger = new Logger(HelpCommand.name);

  constructor(
    private readonly commands: CommandsMessage,
    private readonly faqs: FAQsMessage,
    private readonly contactUs: ContactUsMessage
  ) {}

  @SlashCommand({
    name: "help",
    description: "Show help menu",
  })
  onSlash(
    @Options() { ephemeralReply, category }: HelpCommandOptions,
    @Context() [interaction]: SlashCommandContext
  ) {
    return interaction.reply({
      ephemeral: isEphemeral({ ephemeralReply }),
      ...HelpMessage.build(category),
    });
  }

  @StringSelect(DcRoute.helpCategories)
  onCategorySelect(
    @Context() [i]: StringSelectContext,
    @SelectedStrings() [selected]: string[]
  ) {
    switch (selected) {
      case HelpCategory.Commands:
        return i.update(this.commands.build());
      case HelpCategory.FAQs:
        return i.update(this.faqs.build());
      case HelpCategory.ContactUs:
        return i.update(this.contactUs.build());
      default:
        throw new Error(`Help category not found : ${selected}`);
    }
  }

  @StringSelect(DcRoute.helpCategory(":categoryId"))
  onCategoryItemSelect(
    @Context() [i]: StringSelectContext,
    @SelectedStrings() [selected]: string[],
    @ComponentParam("categoryId") categoryId: string
  ) {
    switch (categoryId) {
      case HelpCategory.Commands:
        return i.update(this.commands.build(selected));
      case HelpCategory.FAQs:
        return i.update(this.faqs.build(selected));
      case HelpCategory.ContactUs:
        return i.update(this.contactUs.build());
      default:
        throw new Error(`Help category not found : ${categoryId}`);
    }
  }
}
