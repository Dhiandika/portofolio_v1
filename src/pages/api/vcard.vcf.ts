import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const GET: APIRoute = async () => {
    const siteConfig = await getEntry('site', 'config');
    const linksConfig = await getEntry('site', 'links');
    
    const site = siteConfig?.data || {} as any;
    const linksData = linksConfig?.data || {} as any;

    const name = linksData.profileName || site.brandName || 'Dhiandika Aditya';
    const email = linksData.vcardEmail || site.email || 'npemburu6@gmail.com';
    const phone = linksData.vcardPhone || '+628123456789';
    const jobTitle = linksData.vcardJobTitle || 'Full-Stack Software Engineer';
    const website = 'https://npemburu.my.id';

    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${name}`,
        `N:Aditya;Dhiandika;;;`,
        `TITLE:${jobTitle}`,
        `EMAIL;TYPE=INTERNET,HOME:${email}`,
        `TEL;TYPE=CELL:${phone}`,
        `URL:${website}`,
        'NOTE:Full-Stack Software Engineer & Neo-Brutalist Web Creator',
        'END:VCARD'
    ].join('\r\n');

    return new Response(vcard, {
        status: 200,
        headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': 'attachment; filename="Dhiandika_Aditya_Contact.vcf"',
        }
    });
};
