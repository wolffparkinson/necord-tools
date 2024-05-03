import { NotFoundException } from '@nestjs/common';
import { ComponentType, MappedComponentTypes, Message } from 'discord.js';

type ComponentTypes = keyof typeof ComponentType;
type Component<T extends ComponentTypes> =
  MappedComponentTypes[(typeof ComponentType)[T]];

export class ComponentExplorer {
  static find<T extends ComponentTypes>(
    options: FindComponentParams<T> & { required: true }
  ): Component<T>;
  static find<T extends ComponentTypes>(
    options: FindComponentParams<T> & { required?: boolean }
  ): Component<T> | null;
  static find<T extends ComponentTypes>(
    options: FindComponentParams<T> & { required?: boolean }
  ) {
    const { message, componentType, customId, required } = options;
    for (const row of message.components ?? []) {
      for (const component of row.components ?? []) {
        if (component.type !== ComponentType[componentType]) continue;
        if (component.customId !== customId) continue;
        return component as Component<T>;
      }
    }

    if (required) {
      throw new NotFoundException(
        `Not found : Message component of type (${componentType})`
      );
    }
    return null;
  }

  static getSelectedValues(component: Component<'StringSelect'>) {
    return component.data.options.filter((o) => o.default).map((o) => o.value);
  }
}

export type FindComponentParams<T extends ComponentTypes> = {
  componentType: T;
  message: Message<boolean>;
  customId: string;
};
