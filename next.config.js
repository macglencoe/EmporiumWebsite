module.exports = {

    headers: async () => [
        {
            source: '/:path*',
            headers: [
                
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
                },
                {
                  key: 'X-Frame-Options',
                  value: 'ALLOW-FROM https://www.facebook.com',
                },
                {
                  key: 'Referrer-Policy',
                  value: 'no-referrer-when-downgrade',
                }
            ]

        }
    ],
    trailingSlash: true,
    getStaticProps: true,
    
    
}