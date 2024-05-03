import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction, EmbedBuilder, bold } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';
import { AutocompleteInterceptor } from 'necord';
import {  PastelColors, Symbols } from '~/constants';
import { LinesBuilder } from '~/utils';
import { DateParser } from './date-parser';
import {
  AcceptType,
  Choices,
  DateTimeAutocompleteOptions,
  DateTimeParser,
} from './datetime.interface';
import { DurationParser } from './duration-parser';

const Parsers = {
  date: new DateParser(),
  duration: new DurationParser(),
};
@Injectable()
export class DateTimeAutocomplete extends AutocompleteInterceptor {
  private readonly accepts: AcceptType[];
  private readonly parsers: DateTimeParser[];
  private readonly examples: Choices;

  constructor(private readonly options: DateTimeAutocompleteOptions) {
    super();

    this.accepts = options.accepts ?? ['duration', 'date'];
    this.parsers = this.accepts.map((a) => Parsers[a as keyof typeof Parsers]);
    if (!options.examples) {
      this.examples = this.parsers.flatMap((p) => p.choices);
    } else {
      this.examples = options.examples.map((c) => {
        if (typeof c === 'string') {
          return { name: `${Symbols.Bullet} ${c}`, value: c };
        }
        return c;
      });
    }
  }

  transformOptions(i: AutocompleteInteraction): any {
    const query = i.options.getString(this.options.name, true);

    // Parse string query to DateTime object
    const dt = this.parse(query);

    // Respond with example choices
    if (!dt) {
      return i.respond(this.examples);
    }

    // Respond with parsed DateTime choice
    else {
      return i.respond([
        {
          name: this.getChoiceName(dt),
          value: query,
        },
      ]);
    }
  }

  parse(query: string) {
    for (const parser of this.parsers) {
      const dt = parser.parse(query);
      if (dt) return dt;
    }

    return null;
  }

  getChoiceName(date: DateTime | Date) {
    if (date instanceof Date) {
      date = DateTime.fromJSDate(date);
    }

    let name = date.toLocaleString(DateTime.DATETIME_MED);
    let duration = humanizeDuration(date.diffNow().toMillis(), {
      round: true,
      largest: 2,
    });
    if (date > DateTime.now()) {
      duration = 'in ' + duration;
    } else {
      duration += ' ago';
    }

    name = duration;
    if (this.accepts.includes('date')) {
      const dateStr = `${date.toLocaleString(DateTime.DATE_MED)} ${date
        .toLocaleString(DateTime.TIME_SIMPLE)
        .toUpperCase()} (${date?.offsetNameShort?.replace('UTC', 'GMT')})`;
      name += ` - ${dateStr}`;
    }

    return name;
  }

  invalidEmbed(query: string) {
    return new EmbedBuilder()
      .setColor(PastelColors.Error)
      .setAuthor({ name: 'INVALID FORMAT' })
      .setDescription(
        new LinesBuilder({ bulleted: false })
          .addLine(`Input : ${bold(query)}`)
          .addLine(`Valid formats :`)
          .addLines(...this.examples.map((ch) => ({ value: ch.name })))
          .toString()
      );
  }
}
