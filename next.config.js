module.exports = {
  env : {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? 'Unknown',
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? 'Unknown',
  },
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