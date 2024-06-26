# Necord Tools

This repository is a collection of reusable tools for Necord, a Discord bot framework.

## Features

- [DeferReply](#deferreply)
- [DeferUpdate](#deferupdate)
- [BotPermissions](#botpermissions)
- [MemberPermissions](#memberpermissions)
- [Interaction](#interaction)
- [GlobalDiscordFilter](#globaldiscordfilter)
- [DmOnlyGuard](#dmonlyguard)
- [GuildOnlyGuard](#guildonlyguard)
- [BotDevGuard](#botdevguard)
- [InteractionLogger](#interactionlogger)
- [EphemeralOption](#ephemeraloption)
- [SlashProvider](#slashprovider)

### DeferReply

- Decorator to defer reply to an interaction

```ts
@DeferReply()
@DeferReply({ ephemeral:true })
```

### DeferUpdate

- Decorator to defers updates to an interaction

```ts
@DeferUpdate()
```

### BotPermissions

- Decorator to ensure bot has permissions

```ts
@BotPermissions("Administrator")
@BotPermissions('Administrator','ManageRoles')
```

### MemberPermissions

- Decorator to ensure member has permissions

```ts
@MemberPermissions("Administrator")
```

### Interaction

- Param decorator to retreive an interaction

```ts
@Interaction()
```

### GlobalDiscordFilter

- Filter to handle error messages

```ts
{
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalDiscordFilter,
    },
  ];
}
```

### DmOnlyGuard

- Limits interactions to DMs

```ts
@UseGuards(DmOnlyGuard)
```

### GuildOnlyGuard

- Limits interactions to Discord servers

```ts
@UseGuards(GuildOnlyGuard)
```

### BotDevGuard

- Limits interactions to bot developers

```ts
@UseGuards(BotDevGuard)
```

### InteractionLogger

- An interceptor to log usage metrics

```ts
{
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InteractionLogger,
    },
  ];
}
```

### EphemeralOption

- Reusable option to add ephemeral option to a command

```ts

export class HelpCommandOptions extends EphemeralOption {}

// Usage
onSlash(
  @Options() { ephemeralReply, category }: HelpCommandOptions,
  @Context() [i]: SlashCommandContext
) {
  return i.reply({
    ephemeral: isEphemeral({ ephemeralReply }),
    content:'Help message'
  });
}
```

### SlashProvider

- Provides all application commands

```ts
@Injectable()
export class MyCommand {
  constructor(private readonly slash: SlashProvider) {}

  @SlashCommand({
    name: "slash-provider",
    description: "Slash provider",
  })
  onSlash(@Ctx() [i]: SlashCommandContext) {
    return i.reply(this.slash.mention("slash-provider"));
  }
}
```

### Examples

Example implementations

- [Eval](./src/modules//admin//eval/eval.command.ts) : Evaluate javascript code
- [Exec](./src/modules//admin//exec/exec.command.ts) : Execute shell commands
- [Database Commands](./src/modules/db-commands/db-commands.service.ts) : Registering commands that are saved in a remote database.
- [Help menu](./src/modules/help) : Multilevel select help menu
- [Invite link](./src/modules/invite/invite.command.ts) : Generate bot invite link dynamically with required permissions.
- [Timestamp](./src/modules/tools/time/time.command.ts) : Discord timestamp using DateTime autocomplete
- [Ping](./src/modules/tools/ping/ping.command.ts) : Ping Pong!
