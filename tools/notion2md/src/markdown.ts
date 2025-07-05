import fs from "fs/promises";
import path from "path";
import { NotionConverter } from "notion-to-md";
import { notion } from "./notion";
import { logger } from "./reporter";
import type { PostProps } from "./types";
import { config } from "./config";

// Variable to store the instance, initially null
let n2m: NotionConverter | null = null;

/**
 * Quietly initializes and returns NotionConverter instance.
 * (Singleton pattern)
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
 * Converts object to YAML Frontmatter format string.
 * @param data - Object to convert
 * @returns YAML string
 */
function createFrontmatter(props: PostProps): string {
  // id is used as filename, so exclude it from frontmatter.
  const { id, ...rest } = props;

  const lines = Object.entries(rest).map(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return `${key}: []`;
      const items = value.map((item) => `  - ${item}`).join("\n");

      return `${key}:\n${items}`;
    }
    // Use JSON.stringify to add quotes to strings and escape special characters.
    return `${key}: ${JSON.stringify(value)}`;
  });

  return `---\n${lines.join("\n")}\n---`;
}

/**
 * Saves a single post as a Markdown file.
 * @param post - Post data to save (PostProps)
 * @param contentDir - Directory path to save to
 */
export async function savePostAsMarkdown(post: PostProps, contentDir: string) {
  const originalConsole = { ...console };
  try {
    // Temporarily disable console to suppress library logs
    Object.keys(console).forEach((key) => {
      (console as any)[key] = () => {};
    });

    const converter = getN2mInstance(); // Get instance when needed.
    const { content: markdownBody } = await converter.convert(post.id);

    const frontmatter = createFrontmatter(post);
    const fullContent = `${frontmatter}\n\n${markdownBody}`;
    const filePath = path.join(contentDir, `${post.slug}.md`);
    await fs.writeFile(filePath, fullContent);
  } catch (error) {
    // Restore console even if error occurs
    Object.assign(console, originalConsole);
    logger.error(`- Failed to save: ${post.slug}`, error);
  }
}
