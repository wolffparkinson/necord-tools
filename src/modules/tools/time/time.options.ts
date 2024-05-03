import { TimestampStyles, TimestampStylesString } from "discord.js";
import { StringOption } from "necord";
import { EphemeralOption } from "~/options";
import { Symbols } from "~/constants";

export class TimeCommandOptions extends EphemeralOption {
  @StringOption({
    name: "when",
    description: "Type a date time",
    min_length: 1,
    autocomplete: true,
    required: true,
  })
  when!: string;

  @StringOption({
    name: "format",
    description: "Timestamp format. Default (Long Date Time)",
    min_length: 1,
    choices: [
      {
        name: `Relative${Symbols.Bullet}in 10 hours`,
        value: TimestampStyles.RelativeTime,
      },
      {
        name: `Short Date Time${Symbols.Bullet}February 8, 2023 at 8:30 PM`,
        value: TimestampStyles.ShortDateTime,
      },
      {
        name: `Long Date Time${Symbols.Bullet}Wednesday, February 8, 2023 at 8:30 PM`,
        value: TimestampStyles.LongDateTime,
      },
      {
        name: `Long Date${Symbols.Bullet}February 8, 2023`,
        value: TimestampStyles.LongDate,
      },
      {
        name: `Short Date${Symbols.Bullet}2/8/2023`,
        value: TimestampStyles.ShortDate,
      },
      {
        name: `Long Time${Symbols.Bullet}8:30:00 PM`,
        value: TimestampStyles.LongTime,
      },
      {
        name: `Short Time${Symbols.Bullet}8:30 PM`,
        value: TimestampStyles.ShortTime,
      },
    ],
  })
  format?: TimestampStylesString;
}
