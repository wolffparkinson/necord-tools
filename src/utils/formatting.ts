import { time, TimestampStyles } from 'discord.js';

export function timestampMs(ms: number, style: keyof typeof TimestampStyles) {
  return time(Math.floor(ms / 1000), TimestampStyles[style]);
}
