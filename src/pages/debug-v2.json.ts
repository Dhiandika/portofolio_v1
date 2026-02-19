
import { getCollection } from 'astro:content';

export async function GET() {
    try {
        const blog = await getCollection('blog');
        const projects = await getCollection('projects');
        return new Response(
            JSON.stringify({
                status: "ok",
                blogCount: blog.length,
                projectsCount: projects.length,
                blogSlugs: blog.map(p => p.slug)
            }, null, 2),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                status: "error",
                message: error.message,
                stack: error.stack
            }, null, 2),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
}
