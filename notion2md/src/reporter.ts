/**
 * 애플리케이션 전체에서 사용할 커스텀 로거.
 * 전역 console 객체가 다른 라이브러리에 의해 덮어쓰여지는 것을 방지하고,
 * 일관된 로깅을 제공합니다.
 */
export const logger = {
  log: (...args: unknown[]) => console.log(...args),
  error: (...args: unknown[]) => console.error(...args),
  group: (...args: unknown[]) => console.group(...args),
  groupEnd: () => console.groupEnd(),
};

interface SummaryData {
  totalPosts: number;
  skippedPosts: { post: any; reason: string }[];
  postsToCreate: any[];
  postsToUpdate: any[];
  filesToDelete: string[];
  upToDateCount: number;
}

export function printSummary(summary: SummaryData) {
  const {
    totalPosts,
    skippedPosts,
    postsToCreate,
    postsToUpdate,
    filesToDelete,
    upToDateCount,
  } = summary;

  logger.group("\n📊 Notion to Markdown Sync Summary");
  logger.log(`  Total posts fetched: ${totalPosts}`);

  logger.group(`  - ⚠️  Warning: ${skippedPosts.length}`);
  if (skippedPosts.length > 0) {
    const emptySlugs = skippedPosts.filter((p) => p.reason === "EMPTY_SLUG");
    if (emptySlugs.length > 0) {
      logger.group("    - Reason: Empty Slug (Title is missing)");
      emptySlugs.forEach(({ post }) =>
        logger.log(`      - "${post.title || "Untitled"}" (ID: ${post.id})`)
      );
      logger.groupEnd();
    }
    const duplicateSlugs = skippedPosts.filter(
      (p) => p.reason === "DUPLICATE_SLUG"
    );
    if (duplicateSlugs.length > 0) {
      logger.group("    - Reason: Duplicate Slug (Keeping the oldest post)");
      duplicateSlugs.forEach(({ post }) =>
        logger.log(
          `      - "${post.title}" (Slug: ${post.slug}, ID: ${post.id})`
        )
      );
      logger.groupEnd();
    }
  }
  logger.groupEnd();

  logger.group(`  - ✨ New: ${postsToCreate.length}`);
  if (postsToCreate.length > 0)
    postsToCreate.forEach((p) => logger.log(`    - ${p.slug}.md`));
  logger.groupEnd();

  logger.group(`  - 🔄 Updated: ${postsToUpdate.length}`);
  if (postsToUpdate.length > 0)
    postsToUpdate.forEach((p) => logger.log(`    - ${p.slug}.md`));
  logger.groupEnd();

  logger.group(`  - 🗑️  Stale: ${filesToDelete.length}`);
  if (filesToDelete.length > 0)
    filesToDelete.forEach((fileName) => logger.log(`    - ${fileName}`));
  logger.groupEnd();

  logger.log(`  - ✅ Up-to-date: ${upToDateCount}`);
  logger.groupEnd();
}
