import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getEntry } from 'astro:content';

export async function GET(context) {
    const { lang } = context.params;
    const posts = await getCollection('blog');
    const siteConfig = await getEntry('site', 'config');
    const { pageTitle, pageTitle_id, metaDescription, metaDescription_id, domainUrl } = siteConfig.data;

    const title = lang === 'id' ? (pageTitle_id || pageTitle) : pageTitle;
    const description = lang === 'id' ? (metaDescription_id || metaDescription) : metaDescription;

    // Sort posts by date
    const sortedPosts = posts.sort((a, b) => new Date(b.data.publishedDate).valueOf() - new Date(a.data.publishedDate).valueOf());

    const items = sortedPosts.map((post) => {
        const postTitle = lang === 'id' ? (post.data.title_id || post.data.title) : post.data.title;
        const postDesc = lang === 'id' ? (post.data.excerpt_id || post.data.excerpt) : post.data.excerpt;

        return {
            title: postTitle,
            pubDate: new Date(post.data.publishedDate),
            description: postDesc,
            link: `/${lang}/blog/${post.slug}/`,
        };
    });

    return rss({
        title: title,
        description: description,
        site: context.site || domainUrl || 'https://arham.exe', // Fallback if domainUrl is missing
        items: items,
        customData: `<language>${lang === 'id' ? 'id-id' : 'en-us'}</language>`,
    });
}

export async function getStaticPaths() {
    return [
        { params: { lang: 'en' } },
        { params: { lang: 'id' } },
    ];
}
