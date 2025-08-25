import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => {
    return data.draft !== true;
  });

  // 포스트를 날짜순으로 정렬
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.publishedAt || a.data.createdAt);
    const dateB = new Date(b.data.publishedAt || b.data.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site || SITE.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishedAt || post.data.createdAt,
      link: `/posts/${post.slug}/`,
      author: post.data.author.join(', '),
      categories: [
        ...(post.data.category ? [post.data.category] : []),
        ...post.data.tags
      ],
    })),
    customData: `<language>ko</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}