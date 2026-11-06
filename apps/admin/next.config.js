const path = require('path')

// Next resolves .env files from the application directory. Local development
// keeps shared secrets at the monorepo root, so load that file explicitly.
// dotenv does not overwrite variables injected by Vercel or the shell.
require('dotenv').config({
  path: path.join(__dirname, '../../.env.local'),
  quiet: true,
})

module.exports = {
  experimental: {
    externalDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
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
}
