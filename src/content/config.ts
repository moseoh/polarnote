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
      tags: z.array(z.string()),
      draft: z.boolean(),
    }),
});

export const collections = {
  posts: postsCollection,
};
