import { Injectable } from "@nestjs/common";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  Client,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  codeBlock,
} from "discord.js";
import { inspect } from "util";
import { DcRoute } from "~/constants";
import { Inputs } from "./eval.constants";

@Injectable()
export class EvalService {
  constructor(private readonly client: Client) {}

  buildModal() {
    return new ModalBuilder()
      .setCustomId(DcRoute.Admin.eval)
      .setTitle("Eval")
      .addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(Inputs.code)
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Code")
            .setPlaceholder("Code to evaluate")
            .setRequired(true)
        ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(Inputs.ephemeral)
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Reply Ephermeral ?")
            .setPlaceholder("true or false")
            .setValue("true")
            .setRequired(true)
            .setMaxLength(5)
        ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(Inputs.depth)
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Inspect Depth")
            .setValue("1")
            .setPlaceholder("Enter a number from 0-10")
            .setRequired(true)
            .setMaxLength(2)
        )
      );
  }

  async clean(data: any, depth: number) {
    if (data && data.constructor.name == "Promise") data = await data;

    if (typeof data !== "string") data = inspect(data, { depth });

    data = data
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(this.client.token, "[REDACTED]");

    if (data.length > 1900) {
      return {
        files: [
          new AttachmentBuilder(Buffer.from(data), {
            name: "response.txt",
          }),
        ],
      };
    }

    return {
      content: codeBlock(data ?? "No response received"),
    };
  }
}
