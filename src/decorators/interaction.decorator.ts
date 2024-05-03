import {
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { BaseInteraction } from 'discord.js';
import { NecordExecutionContext } from 'necord';

export const Interaction = createParamDecorator((data, ctx) => {
  const necordContext = NecordExecutionContext.create(ctx);
  const [interaction] = necordContext.getContext<'interactionCreate'>();
  if (interaction instanceof BaseInteraction) return interaction;

  throw new InternalServerErrorException('Not an interaction');
});
