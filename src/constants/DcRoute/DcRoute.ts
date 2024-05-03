import { Admin } from "./Admin";

/**
 * Routes to discord components
 */
export const DcRoute = {
  Admin,
  helpCategories: `/help/categories` as const,
  helpCategory(id: string) {
    return `${this.helpCategories}/${id}` as const;
  },
};
