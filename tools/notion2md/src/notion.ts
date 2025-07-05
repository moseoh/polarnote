import { Client } from "@notionhq/client";
import { logger } from "./reporter";
import { parsePageProperties } from "./utils";
import type { PageObject, PostProps } from "./types";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * 데이터베이스에서 모든 게시물(페이지)을 가져와 PostProps 형태로 변환합니다.
 * @param databaseId - 쿼리할 데이터베이스의 ID
 * @returns PostProps 객체 배열
 */
export async function getPosts(databaseId: string): Promise<PostProps[]> {
  const posts: PostProps[] = [];
  try {
    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "draft",
        checkbox: {
          equals: false,
        },
      },
      sorts: [
        {
          property: "date",
          direction: "descending",
        },
      ],
    });

    for (const page of results) {
      if (!("properties" in page)) {
        continue;
      }
      posts.push(parsePageProperties(page as PageObject));
    }
    return posts;
  } catch (error) {
    logger.error("Could not query database.", error);
    return [];
  }
}
