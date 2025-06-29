import fs from "fs/promises";
import { config } from "./config";
import type { CacheData } from "./types";
import { logger } from "./reporter";

/**
 * .cache/cache.json 파일에서 캐시 데이터를 불러옵니다.
 */
export async function loadCache(): Promise<CacheData> {
  try {
    await fs.mkdir(config.fs.cacheDir, { recursive: true });
    const fileContent = await fs.readFile(config.fs.cachePath, "utf-8");
    return JSON.parse(fileContent) as CacheData;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    }
    logger.error("Could not load cache file.", error);
    return {};
  }
}

/**
 * 캐시 데이터를 .cache/cache.json 파일에 저장합니다.
 */
export async function saveCache(data: CacheData): Promise<void> {
  try {
    await fs.mkdir(config.fs.cacheDir, { recursive: true });
    await fs.writeFile(config.fs.cachePath, JSON.stringify(data, null, 2));
  } catch (error) {
    logger.error("Could not save cache file.", error);
  }
}
