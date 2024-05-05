import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { ExternalContextCreator } from "@nestjs/core";
import { ParamMetadata } from "@nestjs/core/helpers/interfaces";
import { STATIC_CONTEXT } from "@nestjs/core/injector/constants";
import { Client, codeBlock } from "discord.js";
import { kebabCase } from "lodash";
import {
  CommandsService,
  Context,
  NecordContextType,
  NecordParamsFactory,
  OPTIONS_METADATA,
  Options,
  SlashCommand,
  SlashCommandContext,
  SlashCommandDiscovery,
  SlashCommandsService,
} from "necord";
import { DbSlashCommand, db } from "./db";
import { EphemeralOption } from "~/options";
import { isEphemeral } from "~/utils";

@Injectable()
export class DbCommandService implements OnApplicationBootstrap {
  private readonly logger = new Logger();
  private readonly necordParamsFactory = new NecordParamsFactory();
  private readonly db = db;

  constructor(
    private readonly slashCommandService: SlashCommandsService,
    private readonly commandService: CommandsService,
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly client: Client
  ) {}

  async onApplicationBootstrap() {
    return this.register();
  }

  private async register() {
    const dbCommands = await this.db.findAll();
    dbCommands.forEach((dbCommand) => {
      const command = this.buildCommand(dbCommand);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      command.setGuilds([undefined]);
      this.slashCommandService.add(command);
    });

    if (this.client.isReady()) {
      this.logger.debug("Registering all commands, client is ready");
      return this.commandService.registerAllCommands();
    } else {
      this.client.once("ready", async () => {
        this.logger.debug("Registering commands manually");
        await this.commandService.registerAllCommands();
      });
    }
  }

  private buildCommand(dbCommand: DbSlashCommand): SlashCommandDiscovery {
    class CommandOptions extends EphemeralOption {}

    if (dbCommand.options.length) {
      this.buildCommandOptions(CommandOptions, dbCommand);
    }

    @Injectable()
    class DbCommand {
      @SlashCommand(dbCommand)
      async onSlash(
        @Options() { ephemeralReply }: CommandOptions,
        @Context() [i]: SlashCommandContext
      ) {
        const ephemeral = isEphemeral({ ephemeralReply }) ?? i.inGuild();
        return i.reply({
          ephemeral,
          content: codeBlock("json", JSON.stringify(dbCommand, undefined, 2)),
        });
      }
    }

    Object.defineProperty(DbCommand, "name", { value: `Tag:${dbCommand.id}` });

    const necordCommand = new SlashCommandDiscovery(dbCommand);

    necordCommand.setDiscoveryMeta({
      class: DbCommand,
      handler: DbCommand.prototype.onSlash,
    });

    necordCommand.setContextCallback(
      this.createContextCallback(
        new DbCommand(),
        DbCommand.prototype,
        "onSlash"
      )
    );

    return necordCommand;
  }

  private buildCommandOptions(target: any, dbCommand: DbSlashCommand) {
    Reflect.defineMetadata(
      OPTIONS_METADATA,
      {
        ...Object.fromEntries(
          dbCommand.options.map((o) => [kebabCase(o.name), o])
        ),
        ...Reflect.getMetadata(OPTIONS_METADATA, target.prototype),
      },
      target.prototype
    );
  }

  private createContextCallback(
    instance: object,
    prototype: any,
    methodName: string
  ) {
    return this.externalContextCreator.create<
      Record<number, ParamMetadata>,
      NecordContextType
    >(
      instance,
      prototype[methodName],
      methodName,
      ROUTE_ARGS_METADATA,
      this.necordParamsFactory,
      STATIC_CONTEXT,
      undefined,
      { guards: true, filters: true, interceptors: true },
      "necord"
    );
  }
}
