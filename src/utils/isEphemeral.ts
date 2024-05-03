import { NotImplementedException } from '@nestjs/common';

interface IsEphemeralOptions {
  ephemeralReply?: boolean | null;
  guildDefault?: boolean | null;
}

export function isEphemeral(
  options: IsEphemeralOptions,
  defaultValue = true
): boolean | undefined {
  const { ephemeralReply, guildDefault } = options;
  return parseOption(ephemeralReply) ?? guildDefault ?? defaultValue;
}

function parseOption(
  ephemeralReply?: string | boolean | null
): boolean | undefined | null {
  if (ephemeralReply === null) return ephemeralReply;

  if (typeof ephemeralReply === 'undefined') return ephemeralReply;

  if (typeof ephemeralReply === 'boolean') return ephemeralReply;

  if (typeof ephemeralReply === 'string') {
    ephemeralReply = ephemeralReply.toLowerCase();
    if (ephemeralReply === 'true') return true;
    else if (ephemeralReply === 'false') return false;
  }

  throw new NotImplementedException(
    `Unable to parse ephemeral reply option of type : ${typeof ephemeralReply}`
  );
}
