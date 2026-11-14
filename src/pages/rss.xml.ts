import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { published, byDateDesc } from '../lib/content.ts';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', published)).sort(byDateDesc);
  return rss({
    title: 'Anup Narayanam: security blog',
    description: 'Plain-language write-ups of recent cyberattacks and security news, with sources.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
