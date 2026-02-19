import { XMLParser } from 'fast-xml-parser';

export interface MediumPost {
    title: string;
    link: string;
    pubDate: string;
    categories: string[];
    thumbnail: string;
    description: string;
}

export async function getMediumPosts(username: string): Promise<MediumPost[]> {
    if (!username || username === '-') return [];

    const cleanUsername = username.replace(/^@/, '');
    try {
        const response = await fetch(`https://medium.com/feed/@${cleanUsername}`);
        const xmlData = await response.text();

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const result = parser.parse(xmlData);

        const items = result.rss?.channel?.item || [];
        const posts = Array.isArray(items) ? items : [items];

        return posts.map((item: any) => {
            // Extract content to find image
            const content = item['content:encoded'] || item.description || '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            const thumbnail = imgMatch ? imgMatch[1] : '';

            // Extract text description (strip HTML)
            const textContent = content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

            return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                categories: Array.isArray(item.category) ? item.category : [item.category].filter(Boolean),
                thumbnail: thumbnail,
                description: textContent
            };
        });
    } catch (error) {
        console.error("Failed to fetch Medium posts:", error);
        return [];
    }
}
