import { Injectable } from "@nestjs/common";
import { Client, OAuth2Scopes, PermissionResolvable } from "discord.js";

@Injectable()
export class UrlProvider {
  constructor(private readonly client: Client) {}

  botInvite(...permissions: PermissionResolvable[]): string {
    return this.client.generateInvite({
      permissions,
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    });
  }
}
