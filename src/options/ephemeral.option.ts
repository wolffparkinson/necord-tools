import { BooleanOption } from 'necord';

export class EphemeralOption {
  @BooleanOption({
    name: 'ephemeral',
    description: 'Should the reply be ephemeral (Default : True)',
    required: false,
  })
  ephemeralReply?: boolean;
}
