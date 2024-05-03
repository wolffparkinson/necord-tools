import { humanizer } from 'humanize-duration';

const shortEn = humanizer({
  language: 'shortEn',
  spacer: '',
  round: true,
  maxDecimalPoints: 0,
  largest: 2,
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
});

export const Humanizers = {
  shortEn,
};
