export const environment = {
  production: true,
  
  // EmailJS Configuration
  emailJsServiceId: 'service_rdnprr3',
  emailJsTemplateId: 'template_id9taaq',
  emailJsPublicKey: 'kjys0AoHlrgGfDVrZ',
  
  // Blog Configuration
  blog: {
    enabled: true,
    postsPerPage: 9,
    enableComments: false,
    enableSearch: true,
    contentPath: '/assets/blog/'
  },
  
  // Admin Configuration
  admin: {
    enabled: true,
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    passwordHash: 'prod-password-hash' // Set via environment variable in deployment
  },
  
  // Feature Flags
  features: {
    enableBlog: true,
    enableProjectDetails: true,
    enableDarkMode: true,
    enableAnimations: true,
    enablePreloading: true
  },
  
  // SEO Configuration
  seo: {
    siteName: 'Miguel Portfolio',
    siteUrl: 'https://miguelemcdev.com', // Update with actual domain
    defaultImage: '/assets/img/og-image.jpg',
    twitterHandle: '@miguel_dev'
  },
  
  // API Endpoints
  api: {
    baseUrl: '/api',
    timeout: 15000
  }
};
