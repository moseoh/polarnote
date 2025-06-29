import { PostProps, PageObject } from "./types";

// Notion API의 각 속성 타입에서 값을 추출하는 헬퍼 함수들
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
  // 첫 번째 파일의 URL만 반환하도록 단순화
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
 * 문자열을 URL 친화적인 슬러그로 변환합니다.
 * @param text - 변환할 문자열
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // 공백을 -으로 교체
    .replace(/[^\w-]+/g, "") // 단어 문자, 하이픈 외 모든 문자 제거
    .replace(/--+/g, "-"); // 여러 개의 -를 단일 -로 교체
}

/**
 * Notion 페이지 객체의 속성을 PostProps 타입으로 파싱합니다.
 * @param page - Notion API로부터 받은 페이지 객체
 * @returns 변환된 PostProps 객체
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
