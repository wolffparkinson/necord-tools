import { Injectable, UseGuards } from "@nestjs/common";
import { exec } from "child_process";
import { AttachmentBuilder, codeBlock } from "discord.js";
import { Ctx, Options, SlashCommandContext } from "necord";
import { inspect } from "util";
import { BotDevGuard } from "~/guards";
import { isEphemeral } from "~/utils";
import { AdminCommand } from "../admin.command";
import { ExecOptions } from "./exec.options";

@UseGuards(BotDevGuard)
@Injectable()
export class ExecCommand {
  @AdminCommand({
    name: "exec",
    description: "Executes shell commands",
  })
  async onEval(
    @Options() { command, ephemeralReply }: ExecOptions,
    @Ctx() [interaction]: SlashCommandContext
  ) {
    const ephemeral = isEphemeral({ ephemeralReply });

    await interaction.deferReply({ ephemeral });

    exec(command, async (err, stdout, stderr) => {
      if (err) return interaction.editReply(this.cleanedMessage(err));

      interaction.editReply(this.cleanedMessage(stdout));
    });
  }

  private cleanedMessage(data: any) {
    if (typeof data !== "string") data = inspect(data);

    data = data
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    if (data.length > 1900) {
      return {
        files: [
          new AttachmentBuilder(Buffer.from(data), { name: "response.txt" }),
        ],
      };
    }

    return {
      content: codeBlock(data ?? "No response"),
    };
  }
}
