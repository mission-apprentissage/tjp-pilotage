import type { MetadataRoute } from 'next';

import { publicConfig } from '@/config.public';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${publicConfig.baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Pages Analyser et Comparer
    {
      url: `${publicConfig.baseUrl}/panorama/region`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${publicConfig.baseUrl}/panorama/departement`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${publicConfig.baseUrl}/panorama/etablissement`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${publicConfig.baseUrl}/panorama/domaine-de-formation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${publicConfig.baseUrl}/panorama/lien-metier-formation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Pages Explorer et Requêter
    {
      url: `${publicConfig.baseUrl}/console/formations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${publicConfig.baseUrl}/console/etablissements`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${publicConfig.baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${publicConfig.baseUrl}/ressources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${publicConfig.baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${publicConfig.baseUrl}/politique-de-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
