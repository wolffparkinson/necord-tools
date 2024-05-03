import { StringOption } from "necord";
import { EphemeralOption } from "~/options";
import { HELP_CATEGORIES } from "./help.constants";

export class HelpCommandOptions extends EphemeralOption {
  @StringOption({
    name: "category",
    description: "Select a help topic",
    choices: HELP_CATEGORIES.map((cat) => ({
      name: cat.label,
      value: cat.id,
    })),
    required: false,
  })
  category?: string;
}
