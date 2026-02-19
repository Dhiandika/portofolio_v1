
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET({ params, props }) {
    const { title, description } = props;

    // Load font
    const fontData = await readFile(join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.ttf'));

    const svg = await satori(
        {
            type: 'div',
            props: {
                children: [
                    {
                        type: 'div',
                        props: {
                            children: [
                                {
                                    type: 'h1',
                                    props: {
                                        children: title,
                                        style: {
                                            fontSize: '64px',
                                            fontWeight: 'bold',
                                            color: '#121212',
                                            lineHeight: 1.1,
                                            marginBottom: '20px',
                                        },
                                    },
                                },
                                {
                                    type: 'p',
                                    props: {
                                        children: description,
                                        style: {
                                            fontSize: '32px',
                                            color: '#333',
                                            lineHeight: 1.4,
                                        },
                                    },
                                },
                            ],
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '80px',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#FBFF48', // Neo-Yellow
                                border: '20px solid #121212',
                            },
                        },
                    },
                    {
                        type: 'div',
                        props: {
                            children: 'ARHAM.EXE',
                            style: {
                                position: 'absolute',
                                bottom: '40px',
                                right: '40px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#121212',
                                backgroundColor: '#FFF',
                                padding: '10px 20px',
                                border: '4px solid #121212',
                                boxShadow: '8px 8px 0 #121212',
                            },
                        },
                    },
                ],
                style: {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                },
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Space Grotesk',
                    data: fontData,
                    style: 'normal',
                },
            ],
        }
    );

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}

export async function getStaticPaths() {
    const blogPosts = await getCollection('blog');
    return blogPosts.map((post) => ({
        params: { slug: post.slug },
        props: {
            title: post.data.title,
            description: post.data.description
        },
    }));
}
