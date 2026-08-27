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
                resume: fields.file({ label: 'Resume / CV File (EN)', directory: 'public', publicPath: '/', description: 'The file linked to the "DOWNLOAD CV" button for English.' }),
                resume_id: fields.file({ label: 'Resume / CV File (ID)', directory: 'public', publicPath: '/', description: 'The file linked to the "DOWNLOAD CV" button for Indonesian.' }),
                signature: fields.image({ label: 'Signature Image', directory: 'public/images', publicPath: '/images/', description: 'Signature to display at the end of bio.' }),

                // Socials
                github: fields.url({ label: 'GitHub URL', description: 'Link to your GitHub profile.', validation: { isRequired: false } }),
                leetcode: fields.url({ label: 'LeetCode URL', description: 'Link to your LeetCode profile.', validation: { isRequired: false } }),
                instagram: fields.url({ label: 'Instagram URL', description: 'Link to your Instagram profile.', validation: { isRequired: false } }),
                linkedin: fields.url({ label: 'LinkedIn URL', description: 'Link to your LinkedIn profile.', validation: { isRequired: false } }),

                // Technical
                gtmId: fields.text({ label: 'GTM ID', description: 'Google Tag Manager ID (e.g., GTM-XXXXXX).' }),
                domainUrl: fields.text({ label: 'Domain URL', description: 'The full URL of your deployed site.' }),
                mediumUsername: fields.text({ label: 'Medium Username', description: 'Your Medium handle (without @) to fetch posts.' }),

                // Layout Flags
                showTestimonials: fields.checkbox({ label: 'Show Testimonials (Client Say) Section', defaultValue: false, description: 'Toggle to show or hide the testimonials section on the homepage.' }),
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
                status: fields.text({ label: 'Status', description: 'Current status headline' }),
                status_id: fields.text({ label: 'Status (ID)', description: 'Indonesian translation' }),
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
        techStack: singleton({
            label: 'Tech Stack List',
            path: 'src/content/site/techstack',
            format: { data: 'json' },
            schema: {
                skills: fields.array(
                    fields.object({
                        name: fields.text({ label: 'Technology Name' }),
                        category: fields.select({
                            label: 'Category',
                            options: [
                                { label: 'Frontend', value: 'Frontend' },
                                { label: 'Backend', value: 'Backend' },
                                { label: 'Database', value: 'Database' },
                                { label: 'Tools / Cloud', value: 'Tools' },
                                { label: 'Machine Learning', value: 'Machine Learning' },
                            ],
                            defaultValue: 'Frontend'
                        }),
                        icon: fields.text({
                            label: 'Icon Name',
                            description: 'e.g., Astro, React, Python, Github (Case Sensitive!)'
                        }),
                    }),
                    { label: 'Skills', itemLabel: props => props.fields.name.value }
                )
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
                        fullMark: fields.integer({ label: 'Full Mark', defaultValue: 100 }),
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
        sidebar: singleton({
            label: 'Sidebar Navigation',
            path: 'src/content/site/sidebar',
            format: { data: 'json' },
            schema: {
                banner: fields.image({
                    label: 'Cover Banner (Image/GIF)',
                    directory: 'public/images/sidebar',
                    publicPath: '/images/sidebar/',
                    description: 'The banner displayed when the sidebar is expanded. Can be a GIF.',
                    validation: { isRequired: false }
                }),
                navItems: fields.array(
                    fields.object({
                        label: fields.text({ label: 'Label (EN)' }),
                        label_id: fields.text({ label: 'Label (ID)' }),
                        path: fields.text({ label: 'Route Path', description: 'e.g. "about", "projects", or leave empty for home ""' }),
                        icon: fields.text({ label: 'Remix Icon Class', description: 'e.g. ri-home-4-fill' })
                    }),
                    {
                        label: 'Navigation Items',
                        itemLabel: props => props.fields.label.value
                    }
                )
            }
        }),
        links: singleton({
            label: 'Link in Bio Page',
            path: 'src/content/site/links',
            format: { data: 'json' },
            schema: {
                title: fields.text({ label: 'Page Title (EN)', description: 'Tab title for the link in bio page' }),
                title_id: fields.text({ label: 'Page Title (ID)', description: 'Indonesian translation' }),
                profileName: fields.text({ label: 'Profile Name (EN)' }),
                profileName_id: fields.text({ label: 'Profile Name (ID)' }),
                bio: fields.text({ label: 'Bio / Subtitle (EN)', multiline: true }),
                bio_id: fields.text({ label: 'Bio / Subtitle (ID)', multiline: true }),
                coverBanner: fields.image({
                    label: 'Profile Cover Banner Image',
                    directory: 'public/images/sidebar',
                    publicPath: '/images/sidebar/',
                    description: 'Gambar sampul header profil di halaman Link in Bio.'
                }),
                showMarquee: fields.checkbox({ label: 'Show Marquee Alert Running Text Bar', defaultValue: true }),
                marqueeText: fields.text({ label: 'Marquee Alert Text (EN)', description: 'Teks pengumuman running-text di bagian paling atas (e.g. "🚀 Open for Freelance Projects!")' }),
                marqueeText_id: fields.text({ label: 'Marquee Alert Text (ID)', description: 'Terjemahan bahasa Indonesia' }),
                showVCard: fields.checkbox({ label: 'Show VCard Contact Download Button', defaultValue: true }),
                vcardEmail: fields.text({ label: 'VCard Contact Email', description: 'Email yang dimasukkan dalam file kontak VCard (.vcf)' }),
                vcardPhone: fields.text({ label: 'VCard Contact Phone', description: 'Nomor telepon yang dimasukkan dalam file kontak VCard (.vcf)' }),
                vcardJobTitle: fields.text({ label: 'VCard Job Title', description: 'Jabatan/pekerjaan yang dimasukkan dalam VCard' }),
                showSearchBar: fields.checkbox({ label: 'Show Live Instant Search Bar', defaultValue: true }),
                showCategoryFilter: fields.checkbox({ label: 'Show Category Filter Tabs', defaultValue: true }),
                showSocials: fields.checkbox({ label: 'Show Social Media Row at Bottom', defaultValue: true }),
                themePreset: fields.select({
                    label: '🎨 Link in Bio Theme Preset',
                    options: [
                        { label: 'Neo-Brutalist Light (Default Yellow/White)', value: 'default' },
                        { label: 'Cyberpunk Dark Mode (Dark Grid & Pink Neon)', value: 'cyberpunk' },
                        { label: 'Retro Paper Vintage (Warm Yellow & Brown)', value: 'retro' },
                    ],
                    defaultValue: 'default'
                }),
                avatar: fields.image({
                    label: 'Profile Avatar Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),
                statusBadge: fields.text({ label: 'Status Badge (EN)', description: 'e.g., "🟢 Available for Projects"' }),
                statusBadge_id: fields.text({ label: 'Status Badge (ID)', description: 'e.g., "🟢 Terbuka untuk Freelance"' }),
                links: fields.array(
                    fields.object({
                        label: fields.text({ label: 'Link Title (EN)' }),
                        label_id: fields.text({ label: 'Link Title (ID)' }),
                        url: fields.text({ label: 'Destination URL' }),
                        icon: fields.text({ label: 'RemixIcon Class', description: 'e.g. ri-global-line, ri-briefcase-line' }),
                        badge: fields.text({ label: 'Badge Text', description: 'e.g. "MAIN", "HOT", "NEW", "PDF"' }),
                        color: fields.select({
                            label: 'Card Accent Color',
                            options: [
                                { label: 'Green', value: 'neo-green' },
                                { label: 'Yellow', value: 'neo-yellow' },
                                { label: 'Blue', value: 'neo-blue' },
                                { label: 'Pink', value: 'neo-pink' },
                                { label: 'Purple', value: 'neo-purple' },
                                { label: 'Orange', value: 'neo-orange' },
                                { label: 'White', value: 'white' },
                            ],
                            defaultValue: 'neo-green'
                        }),
                        category: fields.select({
                            label: 'Content Category',
                            options: [
                                { label: 'Main Website', value: 'Main' },
                                { label: 'Creation & Brands', value: 'Creation' },
                                { label: 'Portfolio & Apps', value: 'Portfolio' },
                                { label: 'Resources & Downloads', value: 'Resources' },
                                { label: 'Contact & Other', value: 'Contact' },
                            ],
                            defaultValue: 'Main'
                        }),
                        gridSize: fields.select({
                            label: 'Card Grid Size (Bento Grid)',
                            options: [
                                { label: 'Full Width (1 Kolom Penuh)', value: 'full' },
                                { label: 'Half Width (Bento Grid 1/2 Kolom)', value: 'half' },
                            ],
                            defaultValue: 'full'
                        }),
                        isHighlighted: fields.checkbox({ label: 'Highlight / Pulse Glow Effect', defaultValue: false }),
                        isActive: fields.checkbox({ label: 'Show on page', defaultValue: true }),
                        description: fields.text({ label: 'Subtitle / Description' }),
                        description_id: fields.text({ label: 'Subtitle / Description (ID)' }),
                        // ─── Advanced Features ──────────────────────────────────────
                        isPinned: fields.checkbox({ label: '📌 Pin to Top (selalu tampil di paling atas)', defaultValue: false }),
                        scheduledStart: fields.date({ label: '📅 Schedule Start Date', description: 'Link hanya tampil mulai tanggal ini. Kosongkan jika selalu tampil.' }),
                        scheduledEnd: fields.date({ label: '📅 Schedule End Date', description: 'Link berhenti tampil setelah tanggal ini. Kosongkan jika tidak ada batas.' }),
                        utmSource: fields.text({ label: '📊 UTM Source', description: 'e.g. "linkinbio". Otomatis ditambahkan ke URL jika UTM tracking aktif.' }),
                        utmCampaign: fields.text({ label: '📊 UTM Campaign', description: 'e.g. "portfolio-2026". Untuk tracking sumber kunjungan.' }),
                        thumbnail: fields.image({ label: '🖼️ Thumbnail Image (opsional)', directory: 'public/images/links', publicPath: '/images/links/', description: 'Gambar latar belakang opsional untuk card link ini.' }),
                    }),
                    {
                        label: 'Links List',
                        itemLabel: props => props.fields.label.value || 'Link Item'
                    }
                ),
                socials: fields.array(
                    fields.object({
                        platform: fields.text({ label: 'Platform Name' }),
                        url: fields.url({ label: 'Profile URL' }),
                        icon: fields.text({ label: 'RemixIcon Class', description: 'e.g. ri-github-fill, ri-linkedin-fill' }),
                        color: fields.select({
                            label: 'Icon Accent Color',
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
                    }),
                    {
                        label: 'Social Media Row',
                        itemLabel: props => props.fields.platform.value || 'Social'
                    }
                ),
                showFeaturedProject: fields.checkbox({ label: 'Show Featured Project Card', defaultValue: true }),
                showFeaturedBlog: fields.checkbox({ label: 'Show Featured Blog Post Card', defaultValue: true }),
                showCuratedBrands: fields.checkbox({ label: 'Show Curated Social Brands Showcase (Holovibe, Shotnime)', defaultValue: true }),
                showCuratedDesigns: fields.checkbox({ label: 'Show Curated Posters & Design Showcase', defaultValue: true }),
                featuredProject: fields.relationship({
                    label: '📌 Featured Project (Pilih Proyek Unggulan Spesifik)',
                    description: 'Pilih proyek spesifik dari koleksi Projects. Jika kosong, akan otomatis mengambil proyek teratas.',
                    collection: 'projects',
                }),
                featuredBlog: fields.relationship({
                    label: '📌 Featured Blog Post (Pilih Artikel Unggulan Spesifik)',
                    description: 'Pilih artikel spesifik dari koleksi Blog. Jika kosong, akan otomatis mengambil artikel terbaru.',
                    collection: 'blog',
                }),
                featuredBrands: fields.array(
                    fields.relationship({
                        label: 'Pilih Brand',
                        collection: 'socialBrands',
                    }),
                    {
                        label: '📌 Featured Social Brands (Urutan Brand Terpilih)',
                        description: 'Pilih brand yang ingin diprioritaskan di showcase.',
                        itemLabel: props => props.value || 'Social Brand',
                    }
                ),
                featuredDesigns: fields.array(
                    fields.relationship({
                        label: 'Pilih Poster/Design',
                        collection: 'designs',
                    }),
                    {
                        label: '📌 Featured Posters & Designs (Urutan Poster Terpilih)',
                        description: 'Pilih poster spesifik dari koleksi Graphics & Posters.',
                        itemLabel: props => props.value || 'Poster Design',
                    }
                ),
                // ─── Analytics & Advanced Feature Toggles ──────────────────────
                showClickCount: fields.checkbox({ label: '📈 Show Click Count Badge on Link Cards', defaultValue: true, description: 'Tampilkan jumlah klik di pojok kanan bawah setiap link card (menggunakan Redis tracking).' }),
                enableUTMTracking: fields.checkbox({ label: '📊 Enable UTM Auto-tracking on Links', defaultValue: true, description: 'Otomatis append ?utm_source & utm_campaign ke URL setiap link untuk tracking Google Analytics.' }),
                showQRCode: fields.checkbox({ label: '📱 Show QR Code Button', defaultValue: true, description: 'Tampilkan tombol floating untuk generate QR Code dari URL halaman Link in Bio ini.' }),
            }
        }),
    },
    ui: {
        brand: { name: 'Dhiandika Aditya' },
        navigation: {
            'Site Settings': ['site', 'radar', 'techStack', 'uses', 'estimator', 'sidebar'],
            'Page Content': ['hero', 'whoami', 'about', 'now', 'links'],
            'Blog': ['blog'],
            'Collections': ['projects', 'designs', 'socialBrands', 'career', 'experience', 'education', 'certificates', 'reviews', 'companies', 'assets'],
        },
    },
    collections: {
        socialBrands: collection({
            label: 'Social Brands (Creation)',
            slugField: 'name',
            path: 'src/content/socialBrands/*',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: '⚠️ Brand Name [REQUIRED]', description: 'Nama unik brand ini, e.g. "Holovibe". Wajib diisi, tidak boleh sama dengan brand lain.' } }),
                platforms: fields.array(
                    fields.object({
                        platformType: fields.select({
                            label: '⚠️ Platform [REQUIRED]',
                            options: [
                                { label: 'TikTok', value: 'TikTok' },
                                { label: 'Instagram', value: 'Instagram' },
                                { label: 'Facebook', value: 'Facebook' },
                            ],
                            defaultValue: 'TikTok'
                        }),
                        username: fields.text({ label: '⚠️ Username [REQUIRED]', description: 'Handle akun, e.g. @vtuber_union. Wajib diisi.' }),
                        profileName: fields.text({ label: '⚠️ Profile Name [REQUIRED]', description: 'Nama tampilan akun. Wajib diisi.' }),
                        avatar: fields.image({
                            label: 'Avatar (Opsional)',
                            description: 'Upload foto profil brand. Jika kosong, akan tampil huruf inisial berwarna.',
                            directory: 'public/images/creations',
                            publicPath: '/images/creations/',
                        }),
                        profileUrl: fields.url({ label: '⚠️ Profile URL [REQUIRED]', description: 'Link langsung ke profil platform ini. Wajib diisi.' }),
                        profileEmbedHtml: fields.text({ label: 'Profile Embed HTML (Opsional)', multiline: true, description: 'Paste kode embed profil dari TikTok/Instagram/Facebook di sini. Jika kosong, tampil placeholder.' }),
                        videos: fields.array(
                            fields.url({ label: 'Video URL' }),
                            { label: 'Showcase Videos (Opsional)', description: 'Paste URL video TikTok/Reel/Reels. Bisa kosong untuk Facebook.', itemLabel: props => props.value || 'Video Link' }
                        )
                    }),
                    {
                        label: '⚠️ Platforms [MIN 1 REQUIRED]',
                        description: 'Tambahkan minimal 1 platform. Setiap platform wajib memiliki Username, Profile Name, dan Profile URL.',
                        itemLabel: props => props.fields.platformType.value
                    }
                )
            }
        }),

        designs: collection({
            label: 'Graphics & Posters',
            slugField: 'title',
            path: 'src/content/designs/*',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                title_id: fields.text({ label: 'Title (ID)', description: 'Indonesian translation.', validation: { isRequired: false } }),
                description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: false } }),
                description_id: fields.text({ label: 'Description (ID)', multiline: true, validation: { isRequired: false } }),
                image: fields.image({
                    label: 'Poster Image',
                    directory: 'public/images/designs',
                    publicPath: '/images/designs/',
                    validation: { isRequired: true }
                }),
                tools: fields.array(fields.text({ label: 'Tool Name' }), { label: 'Tools Used (e.g. Figma, Canva)' }),
                link: fields.url({ label: 'External Link', validation: { isRequired: false } }),
                order: fields.integer({
                    label: '📌 Display Order',
                    description: 'Lower number = shown first.',
                    defaultValue: 99,
                    validation: { isRequired: false, min: 1, max: 999 },
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
                order: fields.integer({
                    label: '📌 Display Order',
                    description: 'Lower number = shown first. e.g. 1 = first, 2 = second. Default 99.',
                    defaultValue: 99,
                    validation: { isRequired: false, min: 1, max: 999 },
                }),
                title_id: fields.text({ label: 'Title (ID)', description: 'Indonesian translation.', validation: { isRequired: false } }),
                description: fields.text({ label: 'Description' }),
                description_id: fields.text({ label: 'Description (ID)', description: 'Indonesian translation.', validation: { isRequired: false } }),
                image: fields.image({
                    label: 'Thumbnail',
                    directory: 'public/images/projects',
                    publicPath: '/images/projects/',
                }),
                link: fields.url({ label: 'Live Demo URL', validation: { isRequired: false } }),
                githubLink: fields.url({ label: 'GitHub Repository URL (optional)', validation: { isRequired: false } }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Web', value: 'Web' },
                        { label: 'Mobile', value: 'Mobile' },
                        { label: 'UI/UX Design', value: 'UI/UX' },
                        { label: 'Other', value: 'Other' },
                    ],
                    defaultValue: 'Web'
                }),
                techStack: fields.array(fields.text({ label: 'Tech' }), { label: 'Tech Stack' }),
                gallery: fields.array(
                    fields.image({
                        label: 'Gallery Image',
                        directory: 'public/images/projects',
                        publicPath: '/images/projects/',
                    }),
                    {
                        label: 'Project Gallery (Max 5)',
                        validation: { length: { max: 5 } }
                    }
                ),
                content: fields.text({ label: 'Content / Full Description', multiline: true, validation: { isRequired: false } }),
                content_id: fields.text({ label: 'Content (ID)', multiline: true, description: 'Indonesian translation.', validation: { isRequired: false } }),
                keyFeatures: fields.array(fields.text({ label: 'Feature' }), { label: 'Key Features (EN)' }),
                keyFeatures_id: fields.array(fields.text({ label: 'Feature (ID)' }), { label: 'Key Features (ID)' }),
                relatedBlog: fields.relationship({ label: '🔗 Related Blog Article (Pilih Artikel Terkait)', collection: 'blog' }),
                clientCompany: fields.relationship({ label: '🏢 Client / Company (Pilih Perusahaan/Klien)', collection: 'companies' }),
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
                link: fields.url({ label: 'Company Link', validation: { isRequired: false } }),
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
                link: fields.url({ label: 'Company Link', validation: { isRequired: false } }),
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
                tasks: fields.array(fields.text({ label: 'Task' }), { label: 'Tasks' }),
                tasks_id: fields.array(fields.text({ label: 'Task (ID)' }), { label: 'Tasks (Indonesian)' }),

                skills_learned: fields.array(fields.text({ label: 'Skill Learned' }), { label: 'What I Learned' }),
                skills_learned_id: fields.array(fields.text({ label: 'Skill Learned (ID)' }), { label: 'What I Learned (Indonesian)' }),

                impact: fields.array(fields.text({ label: 'Impact Item' }), { label: 'Impact' }),
                impact_id: fields.array(fields.text({ label: 'Impact Item (ID)' }), { label: 'Impact (Indonesian)' }),

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
                link: fields.url({ label: 'Institution Link', validation: { isRequired: false } }),
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
                topics: fields.array(fields.text({ label: 'Topic' }), { label: 'Topics (Tags)' }),
                canonicalUrl: fields.url({ label: 'Canonical URL', description: 'Original Medium URL (if cross-posted).', validation: { isRequired: false } }),
                relatedProject: fields.relationship({ label: '🔗 Related Project (Pilih Proyek Terkait)', collection: 'projects' }),
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
                        { label: 'Certification', value: 'Certification' },
                        { label: 'Organization', value: 'Organization' },
                        { label: 'Appreciation', value: 'Appreciation' },
                    ],
                    defaultValue: 'Course'
                }),
                tags: fields.array(
                    fields.text({ label: 'Tag' }),
                    { label: 'Tags (Multi-label)', description: 'e.g., Cloud Computing, React, GCP, Machine Learning' }
                ),
                image: fields.image({
                    label: 'Certificate Image',
                    directory: 'public/images/certificates',
                    publicPath: '/images/certificates/',
                    validation: { isRequired: false }
                }),
                link: fields.url({ label: 'Credential URL', validation: { isRequired: false } }),
                credentialId: fields.text({ label: 'Credential ID', validation: { isRequired: false } }),
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
                link: fields.url({ label: 'Website URL', validation: { isRequired: false } }),
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
