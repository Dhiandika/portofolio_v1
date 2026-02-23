/**
 * ============================================================================
 * ⚠️ WARNING: DO NOT MODIFY THIS FILE LIGHTLY ⚠️
 * ============================================================================
 * 
 * This file (keystatic.config.ts) defines the ENTIRE schema for your CMS.
 * It strictly dictates how your content is structured in the `src/content/` folder.
 * 
 * Changing fields, renaming collections, or altering types here WILL BREAK existing content 
 * and cause the website to fail during the build process if the Astro content collections 
 * (`src/content/config.ts`) do not match perfectly.
 * 
 * If you must make changes:
 * 1. Think twice before proceeding.
 * 2. Ensure you also update `src/content/config.ts` to match the exact schema changes.
 * 3. Update all affected `.md`, `.mdx`, and `.json` files in `src/content/` to match the new schema.
 * 4. Update the Astro components that consume this data.
 * 
 * ============================================================================
 */

import { config, fields, collection, singleton } from '@keystatic/core';
// @ts-ignore
// import siteConfig from './src/content/site/config.json';

export default config({
    storage: import.meta.env?.MODE === 'production'
        ? {
            kind: 'cloud',
        }
        : {
            kind: 'local',
        },
    cloud: {
        project: 'dhiandika/portofoliov1',
    },
    singletons: {
        site: singleton({
            label: 'Site Settings (Identity, SEO, Contact)',
            path: 'src/content/site/config',
            format: { data: 'json' },
            schema: {
                // Identity & SEO
                pageTitle: fields.text({ label: 'Page Title', description: 'The title shown in the browser tab (e.g., "Dhiandika | Full Stack Brutalist")' }),
                pageTitle_id: fields.text({ label: 'Page Title (ID)', description: 'Indonesian translation.' }),
                metaDescription: fields.text({ label: 'Meta Description', multiline: true, description: 'Used for SEO and social sharing previews.' }),
                metaDescription_id: fields.text({ label: 'Meta Description (ID)', multiline: true, description: 'Indonesian translation.' }),
                metaKeywords: fields.text({ label: 'Meta Keywords', description: 'Comma-separated keywords for SEO.' }),
                brandName: fields.text({ label: 'Brand Name', description: 'Displayed in the Navbar (top left) and Footer.' }),
                favicon: fields.image({ label: 'Favicon', directory: 'public', publicPath: '/', description: 'The small icon in the browser tab.' }),
                ogImage: fields.image({ label: 'OG Image', directory: 'public', publicPath: '/', description: 'Image shown when sharing on social media.' }),

                // Contact & Info
                email: fields.text({ label: 'Email Address', description: 'Displayed in the Contact section.' }),
                location: fields.text({ label: 'Location', description: 'Shown in the About section (e.g., "WORLDWIDE").' }),
                resume: fields.file({ label: 'Resume / CV File', directory: 'public', publicPath: '/', description: 'The file linked to the "DOWNLOAD CV" button.' }),
                signature: fields.image({ label: 'Signature Image', directory: 'public/images', publicPath: '/images/', description: 'Signature to display at the end of bio.' }),

                // Socials
                github: fields.url({ label: 'GitHub URL', description: 'Link to your GitHub profile.' }),
                leetcode: fields.url({ label: 'LeetCode URL', description: 'Link to your LeetCode profile.' }),
                instagram: fields.url({ label: 'Instagram URL', description: 'Link to your Instagram profile.' }),
                linkedin: fields.url({ label: 'LinkedIn URL', description: 'Link to your LinkedIn profile.' }),

                // Technical
                gtmId: fields.text({ label: 'GTM ID', description: 'Google Tag Manager ID (e.g., GTM-XXXXXX).' }),
                domainUrl: fields.text({ label: 'Domain URL', description: 'The full URL of your deployed site.' }),
                mediumUsername: fields.text({ label: 'Medium Username', description: 'Your Medium handle (without @) to fetch posts.' }),
            }
        }),
        hero: singleton({
            label: 'Hero Section',
            path: 'src/content/site/hero',
            format: { data: 'json' },
            schema: {
                title: fields.text({ label: 'Hero Title', description: 'The massive text in the center of the screen (e.g., "FULL STACK DEVELOPER").' }),
                title_id: fields.text({ label: 'Hero Title (ID)', description: 'Indonesian translation.' }),
                bio: fields.text({ label: 'Hero Bio', multiline: true, description: 'The subtitle text below the main title.' }),
                bio_id: fields.text({ label: 'Hero Bio (ID)', multiline: true, description: 'Indonesian translation.' }),
                techStack: fields.array(
                    fields.object({
                        name: fields.text({ label: 'Name' }),
                        icon: fields.image({
                            label: 'Icon',
                            directory: 'public/images/logos',
                            publicPath: '/images/logos/',
                        }),
                    }),
                    {
                        label: 'Hero Tech Stack',
                        itemLabel: props => props.fields.name.value
                    }
                ),
            }
        }),
        about: singleton({
            label: 'About Page (Detailed)',
            path: 'src/content/site/about',
            format: { data: 'json' },
            schema: {
                bio: fields.text({ label: 'About Bio', multiline: true, description: 'The main text in the "Who am I?" section. Supports Markdown-style > blockquotes.' }),
                bio_id: fields.text({ label: 'About Bio (ID)', multiline: true, description: 'Indonesian translation.' }),
                profileImage: fields.image({ label: 'Profile Image', directory: 'public/images', publicPath: '/images/', description: 'The photo displayed in the About section.' }),
            }
        }),
        whoami: singleton({
            label: 'Who Am I (Homepage)',
            path: 'src/content/site/whoami',
            format: { data: 'json' },
            schema: {
                bio: fields.text({ label: 'Main Bio', multiline: true, description: 'The text displayed on the homepage "Who Am I" section.' }),
                bio_id: fields.text({ label: 'Main Bio (ID)', multiline: true, description: 'Indonesian translation.' }),
                profileImage: fields.image({ label: 'Profile Image', directory: 'public/images', publicPath: '/images/', description: 'Image shown on the homepage card.' }),
            }
        }),
        now: singleton({
            label: 'Now / System Status',
            path: 'src/content/now/data',
            format: { data: 'json' },
            schema: {
                working: fields.text({ label: 'Working On', description: 'What are you building currently?' }),
                learning: fields.text({ label: 'Learning', description: 'What are you studying?' }),
                reading: fields.text({ label: 'Reading', description: 'Current book or article.' }),
                listening: fields.text({ label: 'Listening', description: 'Current jam.' }),
                location: fields.text({ label: 'Location', description: 'Current physical location.' }),
            }
        }),
        availability: singleton({
            label: 'Availability Status',
            path: 'src/content/site/availability',
            format: { data: 'json' },
            schema: {
                status: fields.select({
                    label: 'Current Status',
                    options: [
                        { label: 'Available for Work', value: 'available' },
                        { label: 'Busy / Limited', value: 'busy' },
                        { label: 'Offline / Vacation', value: 'offline' },
                    ],
                    defaultValue: 'available'
                }),
                message: fields.text({ label: 'Status Message', description: 'Short text shown next to the dot (e.g., "Open for freelance").' }),
                message_id: fields.text({ label: 'Status Message (ID)', description: 'Indonesian translation.' }),
                socials: fields.array(
                    fields.object({
                        platform: fields.text({ label: 'Platform Name' }),
                        url: fields.url({ label: 'Profile URL' }),
                        icon: fields.text({ label: 'RemixIcon Class', description: 'e.g. ri-github-fill' }),
                        color: fields.select({
                            label: 'Brand Color',
                            options: [
                                { label: 'Green', value: 'neo-green' },
                                { label: 'Blue', value: 'neo-blue' },
                                { label: 'Pink', value: 'neo-pink' },
                                { label: 'Purple', value: 'neo-purple' },
                                { label: 'Orange', value: 'neo-orange' },
                                { label: 'White', value: 'white' },
                            ],
                            defaultValue: 'white'
                        }),
                    }),
                    {
                        label: 'Social Links (Contact Widget)',
                        itemLabel: props => props.fields.platform.value
                    }
                ),
            }
        }),
        radar: singleton({
            label: 'Tech Radar Chart',
            path: 'src/content/radar/data',
            format: { data: 'json' },
            schema: {
                categories: fields.array(
                    fields.object({
                        label: fields.text({ label: 'Label (e.g. Frontend)' }),
                        value: fields.integer({ label: 'Value (0-100)', validation: { min: 0, max: 100 } }),
                        fullMark: fields.integer({ label: 'Full Mark', defaultValue: 100, validation: { isRequired: true } }),
                    }),
                    {
                        label: 'Radar Axes',
                        itemLabel: props => `${props.fields.label.value}: ${props.fields.value.value}%`
                    }
                ),
                details: fields.text({
                    label: 'Analysis Details',
                    multiline: true,
                    description: 'Content for the "Details" tab in the Skill Analysis widget.'
                })
            }
        }),
        uses: singleton({
            label: 'System Specs (/uses)',
            path: 'src/content/site/uses',
            format: { data: 'json' },
            schema: {
                hardware: fields.array(
                    fields.object({
                        name: fields.text({ label: 'Item Name' }),
                        detail: fields.text({ label: 'Detail / Specs' }),
                        category: fields.select({
                            label: 'Category',
                            options: [
                                { label: 'Workstation', value: 'Workstation' },
                                { label: 'Peripherals', value: 'Peripherals' },
                                { label: 'Audio', value: 'Audio' },
                                { label: 'Mobile', value: 'Mobile' },
                            ],
                            defaultValue: 'Workstation'
                        }),
                    }),
                    {
                        label: 'Hardware List',
                        itemLabel: props => `${props.fields.name.value} (${props.fields.category.value})`
                    }
                ),
                software: fields.array(
                    fields.object({
                        name: fields.text({ label: 'Software Name' }),
                        detail: fields.text({ label: 'Usage / Detail' }),
                        category: fields.select({
                            label: 'Category',
                            options: [
                                { label: 'Editor', value: 'Editor' },
                                { label: 'Terminal', value: 'Terminal' },
                                { label: 'Design', value: 'Design' },
                                { label: 'Productivity', value: 'Productivity' },
                            ],
                            defaultValue: 'Editor'
                        }),
                    }),
                    {
                        label: 'Software List',
                        itemLabel: props => `${props.fields.name.value} (${props.fields.category.value})`
                    }
                ),
                wallpaper: fields.image({
                    label: 'Desk Setup / Wallpaper',
                    directory: 'public/images/uses',
                    publicPath: '/images/uses/',
                })
            }
        }),
        estimator: singleton({
            label: 'Project Estimator',
            path: 'src/content/site/estimator',
            format: { data: 'json' },
            schema: {
                services: fields.array(
                    fields.object({
                        id: fields.text({ label: 'ID (Unique)' }),
                        name: fields.text({ label: 'Service Name' }),
                        price: fields.number({ label: 'Price ($)' }),
                        category: fields.select({
                            label: 'Category',
                            options: [
                                { label: 'Core', value: 'Core' },
                                { label: 'Add-on', value: 'Add-on' },
                            ],
                            defaultValue: 'Core'
                        }),
                    }),
                    {
                        label: 'Services List',
                        itemLabel: props => `${props.fields.name.value} ($${props.fields.price.value})`
                    }
                ),
                currencySymbol: fields.text({ label: 'Currency Symbol', defaultValue: '$' }),
            }
        }),
    },
    ui: {
        brand: { name: 'Npemburu.exe' },
        navigation: {
            'Site Settings': ['site', 'radar', 'uses', 'estimator'],
            'Page Content': ['hero', 'whoami', 'about', 'now'],
            'Blog': ['blog'],
            'Collections': ['projects', 'career', 'experience', 'education', 'certificates', 'reviews', 'companies', 'assets'],
        },
    },
    collections: {
        skills: collection({
            label: 'Skills (Tech Stack)',
            slugField: 'name',
            path: 'src/content/skills/*',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: 'Technology Name' } }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Library', value: 'Library' },
                        { label: 'Framework', value: 'Framework' },
                        { label: 'Language', value: 'Language' },
                        { label: 'Backend', value: 'Backend' },
                        { label: 'Styling', value: 'Styling' },
                        { label: 'Data', value: 'Data' },
                        { label: 'Core', value: 'Core' },
                        { label: 'Version', value: 'Version' },
                        { label: 'Query', value: 'Query' },
                        { label: 'Ops', value: 'Ops' },
                        { label: '3D', value: '3D' },
                    ],
                    defaultValue: 'Language'
                }),
                color: fields.select({
                    label: 'Hover Color',
                    options: [
                        { label: 'Green', value: 'neo-green' },
                        { label: 'Yellow', value: 'neo-yellow' },
                        { label: 'Blue', value: 'neo-blue' },
                        { label: 'Pink', value: 'neo-pink' },
                        { label: 'Purple', value: 'neo-purple' },
                        { label: 'Orange', value: 'neo-orange' },
                        { label: 'White', value: 'white' },
                    ],
                    defaultValue: 'white'
                }),
            }
        }),
        projects: collection({
            label: 'Projects',
            slugField: 'title',
            path: 'src/content/projects/*',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                title_id: fields.text({ label: 'Title (ID)', description: 'Indonesian translation.' }),
                description: fields.text({ label: 'Description' }),
                description_id: fields.text({ label: 'Description (ID)', description: 'Indonesian translation.' }),
                image: fields.image({
                    label: 'Thumbnail',
                    directory: 'public/images/projects',
                    publicPath: '/images/projects/',
                }),
                link: fields.url({ label: 'Project Link' }),
                techStack: fields.array(fields.text({ label: 'Tech' }), { label: 'Tech Stack' }),
                gallery: fields.array(
                    fields.image({
                        label: 'Gallery Image',
                        directory: 'public/images/projects',
                        publicPath: '/images/projects/',
                        validation: { isRequired: true }
                    }),
                    {
                        label: 'Project Gallery (Max 5)',
                        validation: { length: { max: 5 } }
                    }
                ),
                content: fields.text({ label: 'Content', multiline: true }),
                content_id: fields.text({ label: 'Content (ID)', multiline: true, description: 'Indonesian translation.' }),
            },
        }),
        experience: collection({
            label: 'Experience Log',
            slugField: 'role',
            path: 'src/content/experience/*',
            format: { data: 'json' },
            schema: {
                role: fields.slug({ name: { label: 'Role' } }),
                role_id: fields.text({ label: 'Role (ID)', description: 'Indonesian translation.' }),
                company: fields.text({ label: 'Company' }),
                link: fields.url({ label: 'Company Link' }),
                date: fields.text({ label: 'Date Range' }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Experience Log (Home)', value: 'Log' },
                    ],
                    defaultValue: 'Log'
                }),
                type: fields.select({
                    label: 'Type',
                    options: [
                        { label: 'Remote', value: 'Remote' },
                        { label: 'Hybrid', value: 'Hybrid' },
                        { label: 'Onsite', value: 'Onsite' },
                    ],
                    defaultValue: 'Remote'
                }),
                logo: fields.image({
                    label: 'Company Logo',
                    directory: 'public/images/logos',
                    publicPath: '/images/logos/',
                }),
                content: fields.text({ label: 'Description', multiline: true }),
                content_id: fields.text({ label: 'Description (ID)', multiline: true, description: 'Indonesian translation.' }),
            },
        }),
        career: collection({
            label: 'Career (Journey)',
            slugField: 'role',
            path: 'src/content/career/*',
            format: { data: 'json' },
            schema: {
                role: fields.slug({ name: { label: 'Role' } }),
                role_id: fields.text({ label: 'Role (ID)', description: 'Indonesian translation.' }),
                company: fields.text({ label: 'Company' }),
                link: fields.url({ label: 'Company Link' }),
                date: fields.text({ label: 'Date Range' }),
                location: fields.text({ label: 'Location' }),
                type: fields.select({
                    label: 'Type',
                    options: [
                        { label: 'Remote', value: 'Remote' },
                        { label: 'Hybrid', value: 'Hybrid' },
                        { label: 'Onsite', value: 'Onsite' },
                    ],
                    defaultValue: 'Remote'
                }),
                logo: fields.image({
                    label: 'Company Logo',
                    directory: 'public/images/logos',
                    publicPath: '/images/logos/',
                }),
                // Details
                tasks: fields.array(fields.text({ label: 'Task' }), { label: 'Tasks', itemLabel: props => props.value }),
                tasks_id: fields.array(fields.text({ label: 'Task (ID)' }), { label: 'Tasks (Indonesian)', itemLabel: props => props.value }),

                skills_learned: fields.array(fields.text({ label: 'Skill Learned' }), { label: 'What I Learned', itemLabel: props => props.value }),
                skills_learned_id: fields.array(fields.text({ label: 'Skill Learned (ID)' }), { label: 'What I Learned (Indonesian)', itemLabel: props => props.value }),

                impact: fields.array(fields.text({ label: 'Impact Item' }), { label: 'Impact', itemLabel: props => props.value }),
                impact_id: fields.array(fields.text({ label: 'Impact Item (ID)' }), { label: 'Impact (Indonesian)', itemLabel: props => props.value }),

                content: fields.text({ label: 'Additional Description', multiline: true }),
                content_id: fields.text({ label: 'Additional Description (ID)', multiline: true, description: 'Indonesian translation.' }),
            },
        }),
        education: collection({
            label: 'Education',
            slugField: 'institution',
            path: 'src/content/education/*',
            format: { data: 'json' },
            schema: {
                institution: fields.slug({ name: { label: 'Institution' } }),
                link: fields.url({ label: 'Institution Link' }),
                degree: fields.text({ label: 'Degree' }),
                degree_id: fields.text({ label: 'Degree (ID)', description: 'Indonesian translation.' }),
                date: fields.text({ label: 'Date Range' }),
                gpa: fields.text({ label: 'GPA', description: 'e.g. 3.80/4.00' }),
                location: fields.text({ label: 'Location' }),
                logo: fields.image({
                    label: 'Institution Logo',
                    directory: 'public/images/logos',
                    publicPath: '/images/logos/',
                }),
                description: fields.text({ label: 'Description', multiline: true }),
                description_id: fields.text({ label: 'Description (ID)', description: 'Indonesian translation.' }),
            },
        }),
        reviews: collection({
            label: 'Testimonials',
            slugField: 'author',
            path: 'src/content/reviews/*',
            format: { data: 'json' },
            schema: {
                author: fields.slug({ name: { label: 'Author Name' } }),
                role: fields.text({ label: 'Role/Title' }),
                quote: fields.text({ label: 'Quote', multiline: true }),
                quote_id: fields.text({ label: 'Quote (ID)', multiline: true, description: 'Indonesian translation.' }),
                rating: fields.integer({ label: 'Rating (1-5)', defaultValue: 5 }),
                color: fields.select({
                    label: 'Card Color Accent',
                    options: [
                        { label: 'Green', value: 'neo-green' },
                        { label: 'Blue', value: 'neo-blue' },
                        { label: 'Pink', value: 'neo-pink' },
                        { label: 'Purple', value: 'neo-purple' },
                        { label: 'Orange', value: 'neo-orange' },
                    ],
                    defaultValue: 'neo-green'
                }),
            }
        }),
        blog: collection({
            label: 'Blog Posts',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                title_id: fields.text({ label: 'Title (ID)', description: 'Indonesian translation.' }),
                publishedDate: fields.date({ label: 'Published Date', validation: { isRequired: true } }),
                coverImage: fields.image({
                    label: 'Cover Image',
                    directory: 'public/images/blog',
                    publicPath: '/images/blog/',
                }),
                excerpt: fields.text({ label: 'Excerpt', multiline: true }),
                excerpt_id: fields.text({ label: 'Excerpt (ID)', multiline: true, description: 'Indonesian translation.' }),
                content: fields.mdx({
                    label: 'Content',
                    options: { image: { directory: 'public/images/blog', publicPath: '/images/blog/' } }
                }),
                content_id: fields.mdx({
                    label: 'Content (ID)',
                    options: { image: { directory: 'public/images/blog', publicPath: '/images/blog/' } }
                }),
                subtitle: fields.text({ label: 'Subtitle', description: 'Medium-style subtitle (optional).' }),
                topics: fields.array(fields.text({ label: 'Topic' }), { label: 'Topics (Tags)', itemLabel: props => props.value }),
                canonicalUrl: fields.url({ label: 'Canonical URL', description: 'Original Medium URL (if cross-posted).' }),
            }
        }),
        certificates: collection({
            label: 'Achievements (Certificates)',
            slugField: 'title',
            path: 'src/content/certificates/*',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Certificate Title' } }),
                title_id: fields.text({ label: 'Title (ID)', description: 'Indonesian translation.' }),
                issuer: fields.text({ label: 'Issuer/Organization' }),
                date: fields.text({ label: 'Date Issued', description: 'e.g. "January 2025"' }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Course', value: 'Course' },
                        { label: 'Bootcamp', value: 'Bootcamp' },
                        { label: 'Event', value: 'Event' },
                        { label: 'Competition', value: 'Competition' },
                    ],
                    defaultValue: 'Course'
                }),
                image: fields.image({
                    label: 'Certificate Image',
                    directory: 'public/images/certificates',
                    publicPath: '/images/certificates/',
                }),
                link: fields.url({ label: 'Credential URL' }),
                description: fields.text({ label: 'Description', multiline: true }),
                description_id: fields.text({ label: 'Description (ID)', multiline: true, description: 'Indonesian translation.' }),
            }
        }),
        companies: collection({
            label: 'Company Logos',
            slugField: 'name',
            path: 'src/content/companies/*',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: 'Company Name' } }),
                logo: fields.image({
                    label: 'Company Logo',
                    directory: 'public/images/companies',
                    publicPath: '/images/companies/',
                    validation: { isRequired: true }
                }),
                link: fields.url({ label: 'Website URL' }),
            }
        }),
        assets: collection({
            label: 'Assets (Download Center)',
            slugField: 'title',
            path: 'src/content/assets/*',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Asset Title' } }),
                type: fields.select({
                    label: 'Type',
                    options: [
                        { label: 'CV / Resume', value: 'Document' },
                        { label: 'Press Kit', value: 'Archive' },
                        { label: 'Logo', value: 'Image' },
                        { label: 'Other', value: 'Other' },
                    ],
                    defaultValue: 'Document'
                }),
                file: fields.file({
                    label: 'File',
                    directory: 'public/assets',
                    publicPath: '/assets/',
                    validation: { isRequired: true }
                }),
                description: fields.text({ label: 'Description' }),
                fileSize: fields.text({ label: 'Size Label', description: 'e.g. "2.5 MB" or "PDF"' }),
            }
        })
    },
});
