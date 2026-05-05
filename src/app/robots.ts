import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/checkout/'],
    },
    sitemap: 'https://ittechbd.com/sitemap.xml',
  };
}
