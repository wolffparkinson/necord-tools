export const HelpCategory = {
  Commands: "commands",
  FAQs: "faq",
  ContactUs: "contact-us",
} as const;

export type HelpCategory = (typeof HelpCategory)[keyof typeof HelpCategory];

export const HELP_CATEGORIES = [
  {
    id: HelpCategory.Commands,
    label: "Commands",
    description: "List of all commands",
    emoji: "#️⃣",
  },
  {
    id: HelpCategory.FAQs,
    label: "FAQs",
    description: "Frequently asked questions",
    emoji: "❓",
  },
  {
    id: HelpCategory.ContactUs,
    label: "Contact Us",
    description: "Contact our support staff",
    emoji: "🌟",
  },
];
