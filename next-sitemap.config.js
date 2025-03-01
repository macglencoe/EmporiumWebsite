module.exports = {
    siteUrl: process.env.SITE_URL || 'https://kingstreetemporium.com',
    generateRobotsTxt: true,
    exclude: [
        '/caffeine/roasts',
        '/caffeine/origins',
        '/pipes/brands',
        '/pipes/materials',
        '/pipes/types',
        '/pipes/[slug]',
        '/cigars/[slug]/size-real'
    ]
}