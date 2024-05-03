import { parse, parseDate } from 'chrono-node';
import { DateTime, FixedOffsetZone } from 'luxon';
import { AcceptType, Choices, DateTimeParser } from './datetime.interface';
import { Symbols } from '~/constants';

export class DateParser extends DateTimeParser {
  type: AcceptType = 'date';
  readonly choices: Choices = [
    {
      name: `${Symbols.Bullet} Today 10AM, Tomorrow 10:30AM EST`,
      value: `Today 10AM`,
    },

    {
      name: `${Symbols.Bullet} 17 Jan 10:30AM EST`,
      value: `17 Jan 10:30AM EST`,
    },
  ];

  parse(query: string) {
    const offsetMin = parse(query)?.at(0)?.start?.get('timezoneOffset') ?? 0;
    const zone = FixedOffsetZone.instance(offsetMin);
    const ref = DateTime.utc().setZone(zone);

    const date = parseDate(query, {
      timezone: offsetMin,
      instant: new Date(ref.year, ref.month - 1, ref.day),
    });
    if (!date) return null;

    const dt = DateTime.fromJSDate(date, { zone });
    return dt;
  }
}
