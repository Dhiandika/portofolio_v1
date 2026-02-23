import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context: any) {
    const blog = await getCollection('blog');
    const siteConfig = await getEntry('site', 'config');

    // fallback to hardcoded if siteConfig is not set
    const title = siteConfig?.data?.pageTitle || 'Portfolio & Blog';
    const description = siteConfig?.data?.metaDescription || 'A neo-brutalist tech portfolio and blog.';

    // Format blog posts for RSS
    const items = blog
        .sort((a, b) => new Date(b.data.publishedDate).getTime() - new Date(a.data.publishedDate).getTime())
        .map((post) => ({
            title: post.data.title,
            pubDate: new Date(post.data.publishedDate),
            description: post.data.excerpt || post.data.subtitle || '',
            link: `/en/blog/${post.slug}/`,
        }));

    return rss({
        title,
        description,
        site: context.site || 'https://dhiandika.vercel.app',
        items,
        customData: `<language>en-us</language>`,
    });
}
