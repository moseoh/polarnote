import "dotenv/config";
import path from "path";

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`환경 변수 ${key}가 설정되지 않았습니다.`);
}

export const config = {
  notion: {
    token: getEnv("NOTION_TOKEN"),
    databaseId: getEnv("DATABASE_ID"),
  },
  fs: {
    contentDir: path.join("./", getEnv("CONTENT_DIR", "public/content")),
    mediaDir: path.join("./", getEnv("MEDIA_DIR", "public/media")),
    cacheDir: path.join("./", ".cache"),
    cachePath: path.join("./", ".cache", "cache.json"),
  },
};
