import { DateTime } from 'luxon';
import parseDuration from 'parse-duration';
import { Symbols } from '~/constants';
import { AcceptType, Choices, DateTimeParser } from './datetime.interface';

export class DurationParser extends DateTimeParser {
  type: AcceptType = 'duration';

  readonly choices: Choices = [
    {
      name: `${Symbols.Bullet} 12hr, 6hr 30m, 3d 2h 10m`,
      value: `12hr`,
    },
  ];

  parse(query: string) {
    query = query.trim();
    const digits = query.match(/\d+/g) ?? [];
    if (digits.join('').length === query.length) {
      query += 'hr';
    }

    let ms = parseDuration(query);
    if (!ms) return null;

    if (query.includes('ago')) ms = -ms;
    const dt = DateTime.utc().plus({ milliseconds: ms });
    return dt;
  }
}
