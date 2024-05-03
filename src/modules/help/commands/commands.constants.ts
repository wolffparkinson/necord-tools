export const CommandCategory = {
  Tools: "tools",
  CategoryB: "categoryB",
} as const;

export type CommandCategory =
  (typeof CommandCategory)[keyof typeof CommandCategory];

export const COMMAND_CATEGORIES = [
  {
    id: CommandCategory.Tools,
    label: "Tools",
    description: "Some useful tools",
    emoji: "🔧",
    commands: ["ping", "invite"],
  },
  {
    id: CommandCategory.CategoryB,
    label: "CategoryB",
    description: "Some useful category",
    emoji: "⭐",
    commands: ["stats"],
  },
];
