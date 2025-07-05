import { notion } from "./notion";

// Extract types from Notion API function return values for centralized management.
type QueryDatabaseResponse = Awaited<ReturnType<typeof notion.databases.query>>;
export type PageObject = Extract<
  QueryDatabaseResponse["results"][number],
  { url: string }
>;

export interface PostProps {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  createdAt: string;
  thumbnail: string | null;
  category: string | null;
  tags: string[];
  summary: string;
  updatedAt: string;
  author: string[];
  draft: boolean;
}

/**
 * Type for individual entries to be stored in cache file
 */
export interface CacheEntry {
  updatedAt: string;
  title: string;
  slug: string;
}

/**
 * Type for entire cache data
 */
export type CacheData = Record<string, CacheEntry>;
