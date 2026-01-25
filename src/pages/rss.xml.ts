import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../config';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sortedPosts = posts.sort((a, b) =>
    b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site || SITE.url,
    trailingSlash: false,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.summary,
      link: `/posts/${post.slug}`,
    })),
  });
}
