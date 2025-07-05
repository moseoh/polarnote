import { PostProps, PageObject } from "./types";

// Helper functions to extract values from each property type of Notion API
const getTitle = (prop: any): string => {
  return prop.title?.[0]?.plain_text ?? "";
};

const getDate = (prop: any): string | null => {
  return prop.date?.start ?? null;
};

const getCreatedTime = (prop: any): string => {
  return prop.created_time;
};

const getFiles = (prop: any): string | null => {
  // Simplified to return only the first file's URL
  return prop.files?.[0]?.file?.url ?? prop.files?.[0]?.external?.url ?? null;
};

const getSelect = (prop: any): string | null => {
  return prop.select?.name ?? null;
};

const getMultiSelect = (prop: any): string[] => {
  return prop.multi_select?.map((tag: any) => tag.name) ?? [];
};

const getRichText = (prop: any): string => {
  return prop.rich_text?.[0]?.plain_text ?? "";
};

const getLastEditedTime = (prop: any): string => {
  return prop.last_edited_time;
};

const getPeople = (prop: any): string[] => {
  return prop.people?.map((person: any) => person.name).filter(Boolean) ?? [];
};

const getCheckbox = (prop: any): boolean => {
  return prop.checkbox ?? false;
};

/**
 * Converts string to URL-friendly slug.
 * @param text - String to convert
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all characters except word characters and hyphens
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Parses Notion page object properties to PostProps type.
 * @param page - Page object received from Notion API
 * @returns Converted PostProps object
 */
export const parsePageProperties = (page: PageObject): PostProps => {
  const { properties } = page;

  const title = getTitle(properties.title);

  return {
    id: page.id,
    title,
    slug: slugify(title) || page.id,
    date: getDate(properties.date),
    createdAt: getCreatedTime(properties.createdAt),
    thumbnail: getFiles(properties.thumbnail),
    category: getSelect(properties.category),
    tags: getMultiSelect(properties.tags),
    summary: getRichText(properties.summary),
    updatedAt: getLastEditedTime(properties.updatedAt),
    author: getPeople(properties.author),
    draft: getCheckbox(properties.draft),
  };
};
