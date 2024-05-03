import {
  Injectable,
  Logger,
  ParseBoolPipe,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Colors,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  bold,
  codeBlock,
  hyperlink,
  inlineCode,
} from "discord.js";
import _ from "lodash";
import { Ctx, Fields, Modal, ModalContext, SlashCommandContext } from "necord";

import { BotDevGuard } from "~/guards";
import { UrlProvider } from "~/providers";
import { DcRoute } from "~/constants";
import { AdminCommand } from "../admin.command";
import { Inputs } from "./eval.constants";
import { EvalService } from "./eval.service";

@Injectable()
@UseGuards(BotDevGuard)
export class EvalCommand {
  private readonly logger = new Logger(EvalCommand.name);
  constructor(
    private readonly service: EvalService,
    private readonly client: Client,
    private readonly urls: UrlProvider
  ) {}

  @AdminCommand({
    name: "eval",
    description: "Evaluates Javascript code",
  })
  async onEval(@Ctx() [interaction]: SlashCommandContext) {
    return interaction.showModal(this.service.buildModal());
  }

  @Modal(DcRoute.Admin.eval)
  async onModalSubmit(
    @Ctx() [interaction]: ModalContext,
    @Fields(Inputs.code) code: string,
    @Fields(Inputs.ephemeral, ParseBoolPipe) ephemeral: boolean,
    @Fields(Inputs.depth, ParseIntPipe) depth: number
  ) {
    await interaction.deferReply({ ephemeral });

    let response;
    try {
      response = await this.service.clean(eval(code), depth);
    } catch (err) {
      response = await this.service.clean(err, depth);
    }
    return interaction.editReply(response);
  }
}
