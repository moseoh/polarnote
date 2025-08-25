import type { APIRoute } from 'astro';
import { SITE } from '../config';

export const GET: APIRoute = () => {
  const robotsTxt = `
# General crawlers
User-agent: *
Allow: /
Crawl-delay: 1

# Search engine crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# AI crawlers - Explicitly allow
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# Documentation and code search crawlers
User-agent: Diffbot
Allow: /

# Disallow certain paths for all bots
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /_astro/

# Sitemap location
Sitemap: ${SITE.url}/sitemap-index.xml

# RSS Feed
Sitemap: ${SITE.url}/rss.xml
  `.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};