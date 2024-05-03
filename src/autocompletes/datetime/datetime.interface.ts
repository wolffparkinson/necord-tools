import type { ApplicationCommandOptionChoiceData } from 'discord.js';
import type { DateTime } from 'luxon';

export type AcceptType = 'duration' | 'date';
export type Choices = ApplicationCommandOptionChoiceData[];

export interface DateTimeAutocompleteOptions {
  name: string;
  accepts?: AcceptType[];
  examples?: (string | ApplicationCommandOptionChoiceData)[];
}

export abstract class DateTimeParser {
  abstract readonly type: AcceptType;
  abstract readonly choices: ApplicationCommandOptionChoiceData[];

  abstract parse(query: string): DateTime | null;
}
