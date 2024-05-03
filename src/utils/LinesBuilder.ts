import { Symbols } from '~/constants';

type BooleanFieldProp = boolean | [boolean] | [boolean | undefined | boolean];

type Field = {
  type: 'field';
  key: string;
  value: string;
  separator?: string;
  bold?: BooleanFieldProp;
  italics?: BooleanFieldProp;
  bullet?: string;
  bulleted?: boolean;
  numbered?: boolean;
};

type Line = {
  type: 'line';
  value: string;
  bullet?: string;
  bulleted?: boolean;
  bold?: boolean;
  italics?: boolean;
  numbered?: boolean;
};

interface BuildLineOptions {
  bullet?: string;
  bulleted?: boolean;
  bold?: boolean;
  italics?: boolean;
  numbered?: boolean;
}
interface BuildFieldOptions {
  bullet?: string;
  bulleted?: boolean;
  bold?: BooleanFieldProp;
  italics?: BooleanFieldProp;
  separator?: string;
  numbered?: boolean;
}

export class LinesBuilder {
  private items = new Array<Field | Line>();
  private readonly options: Required<LinesBuilderOptions>;

  constructor(options?: LinesBuilderOptions) {
    const {
      bold,
      bullet,
      bulleted,
      fieldSeparator,
      lineSeparator,
      italics,
      numbered,
    } = options ?? {};
    this.options = {
      bold: bold ?? false,
      bullet: bullet ?? Symbols.Bullet,
      bulleted: bulleted ?? true,
      fieldSeparator: fieldSeparator ?? ' : ',
      lineSeparator: lineSeparator ?? '\n',
      italics: italics ?? false,
      numbered: numbered ?? false,
    };
  }

  get size(): number {
    return this.items.length;
  }

  addLineBreak(options?: BuildLineOptions) {
    this.items.push({
      type: 'line',
      value: '',
      bulleted: false,
      numbered: false,
      ...options,
    });
    return this;
  }

  addLine(value: string | null, options?: BuildLineOptions) {
    if (value === null) return this;
    this.items.push({ type: 'line', value, ...options });
    return this;
  }

  addLines(...lines: Array<string | ({ value: string } & BuildLineOptions)>) {
    lines.forEach((line) => {
      if (typeof line === 'string') {
        this.addLine(line);
      } else {
        const { value, ...options } = line;
        this.addLine(value, options);
      }
    });
    return this;
  }

  addField(key: string, value: string, options?: BuildFieldOptions) {
    this.items.push({ type: 'field', key, value, ...options });
    return this;
  }

  addFields(
    ...fields: Array<{ key: string; value: string } & BuildFieldOptions>
  ) {
    fields.forEach(({ key, value, ...options }) =>
      this.addField(key, value, options)
    );
    return this;
  }

  upsertField(key: string, value: string, options?: BuildFieldOptions) {
    const fieldIdx = this.items.findIndex((l) => {
      if (l.type !== 'field') return;
      return l.key === key;
    });

    const field: Field = { type: 'field', key, value, ...options };
    if (fieldIdx !== -1) {
      this.items.splice(fieldIdx, 1, field);
    } else {
      this.items.push(field);
    }

    return this;
  }

  remove(key: string) {
    this.items = this.items.filter((line) => {
      switch (line.type) {
        case 'field':
          return line.key === key;
        case 'line':
          return line.value === key;
        default:
          return false;
      }
    });
    return this;
  }

  toString(): string | null;
  toString(required: boolean): string;
  toString(required?: boolean) {
    if (!this.items.length) {
      if (required) {
        throw new Error(`Failed to build message : No lines found`);
      }
      return null;
    }

    const lines: string[] = [];

    let count = 0;
    this.items.forEach((item) => {
      let line = ``;

      if (this.options.numbered) {
        if (item.numbered === false || item.bulleted || item.bullet) {
          count = 0;
        } else {
          count++;
          line += count.toString() + Symbols.Bullet;
        }
      }
      line += this.toLine(item);

      lines.push(line);
    });

    return lines.join(this.options.lineSeparator);
  }

  private bold(string: string) {
    return `**${string}**`;
  }

  private italics(string: string) {
    return `*${string}*`;
  }

  private toLine(data: Line | Field) {
    let line = ``;

    let bulleted = false;
    if (data.bullet) {
      bulleted = true;
    } else if (typeof data.bulleted === 'boolean') {
      bulleted = data.bulleted;
    } else {
      if (!this.options.numbered) {
        bulleted = this.options.bulleted;
      }
    }
    if (bulleted) {
      const bullet = data.bullet ?? this.options.bullet;
      line += bullet + ' ';
    }

    switch (data.type) {
      case 'field': {
        // Key
        let key = data.key;
        let keyBold = Array.isArray(data.bold) ? data.bold[0] : data.bold;
        keyBold = keyBold ?? this.options.bold;
        if (keyBold) key = this.bold(key);

        const keyItalics = Array.isArray(data.italics)
          ? data.italics[0]
          : data.italics;
        if (keyItalics) key = this.italics(key);

        line += key;

        // Separator
        const separator = data.separator ?? this.options.fieldSeparator;
        line += separator;

        // Value
        let value = data.value;
        const valueBold = Array.isArray(data.bold)
          ? data.bold.at(1)
          : data.bold;
        if (valueBold) value = this.bold(value);

        let valueItalics = Array.isArray(data.italics)
          ? data.italics.at(1)
          : data.italics;
        valueItalics = valueItalics ?? this.options.italics;
        if (valueItalics) value = this.italics(value);

        line += value;
        break;
      }

      case 'line': {
        let value = data.value;
        const bold = data.bold ?? this.options.bold;
        if (bold) value = this.bold(value);

        const italics = data.italics ?? this.options.italics;
        if (italics) value = this.italics(value);

        line += value;
        break;
      }

      default:
        break;
    }
    return line;
  }
}

interface LinesBuilderOptions {
  lineSeparator?: string;
  bulleted?: boolean;
  bullet?: string;
  fieldSeparator?: string;
  bold?: boolean;
  italics?: boolean;
  numbered?: boolean;
}
