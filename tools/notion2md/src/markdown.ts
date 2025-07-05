import fs from "fs/promises";
import path from "path";
import { NotionConverter } from "notion-to-md";
import { notion } from "./notion";
import { logger } from "./reporter";
import type { PostProps } from "./types";
import { config } from "./config";

// 인스턴스를 저장할 변수, 처음에는 null
let n2m: NotionConverter | null = null;

/**
 * NotionConverter 인스턴스를 조용히 초기화하고 반환합니다.
 * (싱글톤 패턴)
 */
const getN2mInstance = (): NotionConverter => {
  if (n2m) return n2m;

  try {
    n2m = new NotionConverter(notion).downloadMediaTo({
      outputDir: config.fs.mediaDir,
      // transformPath: (localPath) => {
      //   return path.join(config.fs.mediaDir, localPath);
      // },
    });
  } catch (error) {
    logger.error("Failed to initialize NotionConverter.", error);
    throw error;
  }

  return n2m;
};

/**
 * 객체를 YAML Frontmatter 형식의 문자열로 변환합니다.
 * @param data - 변환할 객체
 * @returns YAML 문자열
 */
function createFrontmatter(props: PostProps): string {
  // id는 파일명이므로 frontmatter에서 제외합니다.
  const { id, ...rest } = props;

  const lines = Object.entries(rest).map(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return `${key}: []`;
      const items = value.map((item) => `  - ${item}`).join("\n");

      return `${key}:\n${items}`;
    }
    // JSON.stringify를 사용하여 문자열에 따옴표를 추가하고 특수 문자를 이스케이프합니다.
    return `${key}: ${JSON.stringify(value)}`;
  });

  return `---\n${lines.join("\n")}\n---`;
}

/**
 * 단일 게시물을 Markdown 파일로 저장합니다.
 * @param post - 저장할 게시물 데이터 (PostProps)
 * @param contentDir - 저장할 디렉토리 경로
 */
export async function savePostAsMarkdown(post: PostProps, contentDir: string) {
  const originalConsole = { ...console };
  try {
    // 라이브러리 로그를 억제하기 위해 console을 임시로 비활성화
    Object.keys(console).forEach((key) => {
      (console as any)[key] = () => {};
    });

    const converter = getN2mInstance(); // 필요할 때 인스턴스를 가져옵니다.
    const { content: markdownBody } = await converter.convert(post.id);

    const frontmatter = createFrontmatter(post);
    const fullContent = `${frontmatter}\n\n${markdownBody}`;
    const filePath = path.join(contentDir, `${post.slug}.md`);
    await fs.writeFile(filePath, fullContent);
  } catch (error) {
    // 에러 발생 시에도 console 복구
    Object.assign(console, originalConsole);
    logger.error(`- Failed to save: ${post.slug}`, error);
  }
}
