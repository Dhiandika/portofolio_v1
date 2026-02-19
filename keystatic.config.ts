import { config, fields, collection, singleton } from '@keystatic/core';
// @ts-ignore
// import siteConfig from './src/content/site/config.json';

export default config({
    storage: {
        kind: 'local',
    },
    singletons: {
        site: singleton({
            label: 'Site Settings (Identity, SEO, Contact)',
            path: 'src/content/site/config',
            format: { data: 'json' },
            schema: {
                // Identity & SEO
                pageTitle: fields.text({ label: 'Page Title', description: 'The title shown in the browser tab (e.g., "ARHAM | Full Stack Brutalist")' }),
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
    },
    ui: {
        brand: { name: 'ARHAM.exe' },
        navigation: {
            'Site Settings': ['site'],
            'Page Content': ['hero', 'whoami', 'about'],
            'Blog': ['blog'],
            'Collections': ['skills', 'projects', 'career', 'experience', 'education', 'certificates', 'reviews'],
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
        })
    },
});
