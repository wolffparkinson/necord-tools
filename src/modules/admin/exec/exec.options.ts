import { StringOption } from "necord";
import { EphemeralOption } from "~/options";

export class ExecOptions extends EphemeralOption {
  @StringOption({
    name: "command",
    description: "Command to exec",
    required: true,
  })
  command!: string;
}
