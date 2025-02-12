import type { MetadataRoute } from 'next';

import { publicConfig } from '@/config.public';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${publicConfig.baseUrl}/sitemap.xml`,
  };
}
