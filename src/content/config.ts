/**
 * ============================================================================
 * ⚠️ WARNING: DO NOT MODIFY THIS FILE LIGHTLY ⚠️
 * ============================================================================
 * 
 * This file (src/content/config.ts) defines Astro's Content Collections schema.
 * It MUST perfectly match the schema defined in `keystatic.config.ts`.
 * 
 * If you change the schema here, you MUST also update `keystatic.config.ts` 
 * and all affected markdown/JSON content files, otherwise Astro will throw 
 * Zod validation errors and fail to build.
 * 
 * ============================================================================
 */

import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        title_id: z.string().optional(),
        description: z.string(),
        description_id: z.string().optional(),
        image: z.string().optional(),
        link: z.string().url(),
        techStack: z.array(z.string()),
        gallery: z.array(z.string()).max(5).optional(),
        content: z.string().optional(),
        content_id: z.string().optional(),
    }),
});

const experience = defineCollection({
    type: 'data',
    schema: z.object({
        role: z.string(),
        role_id: z.string().optional(),
        company: z.string(),
        link: z.string().url().optional(),
        date: z.string(),
        category: z.enum(['Career', 'Log']).default('Log'),
        type: z.enum(['Remote', 'Hybrid', 'Onsite']).optional(),
        logo: z.string().optional(),
        content: z.string().optional(),
        content_id: z.string().optional(),
    }),
});

const career = defineCollection({
    type: 'data',
    schema: z.object({
        role: z.string(),
        role_id: z.string().optional(),
        company: z.string(),
        link: z.string().url().optional(),
        date: z.string(),
        location: z.string().optional(),
        type: z.enum(['Remote', 'Hybrid', 'Onsite']).optional(),
        logo: z.string().optional(),
        // Detailed lists
        tasks: z.array(z.string()).optional(),
        tasks_id: z.array(z.string()).optional(),
        skills_learned: z.array(z.string()).optional(),
        skills_learned_id: z.array(z.string()).optional(),
        impact: z.array(z.string()).optional(),
        impact_id: z.array(z.string()).optional(),
        content: z.string().optional(),
        content_id: z.string().optional(),
    }),
});

const education = defineCollection({
    type: 'data',
    schema: z.object({
        institution: z.string(),
        link: z.string().url().optional(),
        degree: z.string(),
        degree_id: z.string().optional(),
        date: z.string(),
        gpa: z.string().optional(),
        location: z.string().optional(),
        logo: z.string().optional(),
        description: z.string().optional(),
        description_id: z.string().optional(),
    }),
});

const skills = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        category: z.enum(['Library', 'Framework', 'Language', 'Backend', 'Styling', 'Data', 'Core', 'Version', 'Query', 'Ops', '3D']),
        color: z.enum(['neo-green', 'neo-yellow', 'neo-blue', 'neo-pink', 'neo-purple', 'neo-orange', 'white']).optional(),
    }),
});

const certificates = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        title_id: z.string().optional(),
        issuer: z.string(),
        date: z.string(),
        category: z.enum(['Course', 'Bootcamp', 'Event', 'Competition']),
        image: z.string().optional(),
        link: z.string().url().optional(),
        credentialId: z.string().optional(),
        skills_verified: z.array(z.string()).optional(),
        description: z.string().optional(),
        description_id: z.string().optional(),
    }),
});

const reviews = defineCollection({
    type: 'data',
    schema: z.object({
        author: z.string(),
        role: z.string(),
        role_id: z.string().optional(),
        quote: z.string(),
        quote_id: z.string().optional(),
        rating: z.number().min(1).max(5),
        color: z.enum(['neo-green', 'neo-yellow', 'neo-blue', 'neo-pink', 'neo-purple', 'neo-orange']),
    }),
});

const site = defineCollection({
    type: 'data',
    schema: z.object({
        // Combined schema for singletons (all fields optional to allow different files)
        pageTitle: z.string().optional(),
        pageTitle_id: z.string().optional(),
        metaDescription: z.string().optional(),
        metaDescription_id: z.string().optional(),
        metaKeywords: z.string().optional(),
        brandName: z.string().optional(),
        favicon: z.string().optional(),
        ogImage: z.string().optional(),
        email: z.string().optional(),
        location: z.string().optional(),
        resume: z.string().optional(),
        resume_id: z.string().optional(),
        signature: z.string().optional(),
        github: z.string().url().optional(),
        leetcode: z.string().url().optional(),
        instagram: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        gtmId: z.string().optional(),
        domainUrl: z.string().optional(),
        mediumUsername: z.string().optional(),

        // Hero
        title: z.string().optional(),
        title_id: z.string().optional(),
        bio: z.string().optional(),
        bio_id: z.string().optional(),
        techStack: z.array(z.object({
            name: z.string(),
            icon: z.string().optional(),
        })).optional(),

        // About
        profileImage: z.string().optional(),
        bio_id_about: z.string().optional(),
        // Availability
        status: z.enum(['available', 'busy', 'offline']).optional(),
        message: z.string().optional(),
        message_id: z.string().optional(),
        socials: z.array(z.object({
            platform: z.string(),
            url: z.string().url(),
            icon: z.string(),
            color: z.string().optional(),
        })).optional(),

        // Uses / System Specs
        hardware: z.array(z.object({
            name: z.string(),
            detail: z.string(),
            category: z.string(),
        })).optional(),
        software: z.array(z.object({
            name: z.string(),
            detail: z.string(),
            category: z.string(),
        })).optional(),
        wallpaper: z.string().optional(),
    }),
});

const blog = defineCollection({
    type: 'content', // MDX/Markdown
    schema: z.object({
        title: z.string(),
        title_id: z.string().optional(),
        publishedDate: z.string(),
        coverImage: z.string().optional(),
        excerpt: z.string(),
        excerpt_id: z.string().optional(),
        subtitle: z.string().optional(),
        topics: z.array(z.string()).optional(),
        canonicalUrl: z.string().url().optional(),
    }),
});

const snippets = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishedDate: z.string(),
        tags: z.array(z.string()).optional(),
    }),
});

const now = defineCollection({
    type: 'data',
    schema: z.object({
        status: z.string(),
        status_id: z.string().optional(),
        location: z.string(),
        learning: z.string(),
        reading: z.string(),
        listening: z.string(),
        working: z.string(),
    }),
});

const radar = defineCollection({
    type: 'data',
    schema: z.object({
        categories: z.array(z.object({
            label: z.string(),
            value: z.number().min(0).max(100),
            fullMark: z.number().default(100),
        })),
    }),
});

const companies = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        logo: z.string(),
        link: z.string().url().optional(),
    }),
});

const assets = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        type: z.enum(['Document', 'Archive', 'Image', 'Other']),
        file: z.string(),
        description: z.string().optional(),
        wallpaper: z.string().optional(),
    }),
});

const estimator = defineCollection({
    type: 'data',
    schema: z.object({
        services: z.array(z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            category: z.string(),
        })),
        currencySymbol: z.string().optional(),
    }),
});

export const collections = {
    projects,
    experience,
    career,
    education,
    skills,
    reviews,
    site,
    blog,
    certificates,
    now,
    radar,
    companies,
    assets,
    estimator,
};