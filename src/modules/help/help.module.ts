import { Module } from '@nestjs/common';
import { CommandsMessage } from './commands';
import { ContactUsMessage } from './contact-us';
import { FAQsMessage } from './faqs';
import { HelpCommand } from './help.command';

@Module({
  imports: [],
  providers: [HelpCommand, CommandsMessage, FAQsMessage, ContactUsMessage],
})
export class HelpModule {}
