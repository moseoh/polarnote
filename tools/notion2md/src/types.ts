import { notion } from "./notion";

// Notion API 함수의 반환 값에서 타입을 추출하여 중앙에서 관리합니다.
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
 * 캐시 파일에 저장될 개별 항목의 타입
 */
export interface CacheEntry {
  updatedAt: string;
  title: string;
  slug: string;
}

/**
 * 전체 캐시 데이터의 타입
 */
export type CacheData = Record<string, CacheEntry>;
