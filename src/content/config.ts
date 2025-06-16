import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date().nullable(),
      author: z.array(z.string()),
      heroImage: image().nullable(),
      category: z.string().nullable(),
      tags: z.array(z.string()).transform((tags) => {
        // 공백을 하이픈으로 변환 후 중복 제거
        const transformedTags = tags.map((tag) => tag.replace(/\s+/g, "-"));
        return [...new Set(transformedTags)];
      }),
      draft: z.boolean(),
    }),
});

export const collections = {
  posts: postsCollection,
};
