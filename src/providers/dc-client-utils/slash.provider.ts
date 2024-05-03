import { Injectable, OnModuleInit } from '@nestjs/common';
import { ApplicationCommand, Client, Collection } from 'discord.js';

@Injectable()
export class SlashProvider implements OnModuleInit {
  private commands = new Collection<string, ApplicationCommand>();

  constructor(private readonly client: Client) {}

  onModuleInit() {
    this.client.once('ready', () => {
      this.refresh();
      setTimeout(this.refresh.bind(this), 2000);
    });
    this.client.on('applicationCommandPermissionsUpdate', () => {
      this.refresh();
    });
  }

  async refresh() {
    if (!this.client.application) return;
    if (this.client.application?.partial) {
      await this.client.application.fetch();
    }

    const commands = await this.client.application.commands.fetch();
    this.commands = commands.sort((a, b) => a.name.localeCompare(b.name));
  }

  mention(name: string) {
    const command = this.commands.find((c) => c.name === name);
    if (!command) {
      return `/${name}`;
      // throw new InternalServerErrorException(`Command not found : ${name}`);
    }
    return `</${command.name}:${command.id}>`;
  }

  getAll() {
    return this.commands;
  }
}
