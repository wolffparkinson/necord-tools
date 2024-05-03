import { DateTime } from 'luxon';
import { Humanizers } from './humanizers';

export function timeLeftStr(ms: number) {
  return (
    Humanizers.shortEn(DateTime.fromMillis(ms).diffNow().toMillis(), {
      units: ['d', 'h', 'm', 's'],
    }) + ' left'
  );
}
