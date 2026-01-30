import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://techsolstice.mitblr.in'

  // Define static routes
  const routes = [
    '',
    '/events',
    '/socials',
    '/passes',
    // Add other public routes here
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))
}
