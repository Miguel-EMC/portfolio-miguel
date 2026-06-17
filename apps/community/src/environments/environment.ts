export const environment = {
  production: false,
  
  // EmailJS Configuration
  emailJsServiceId: 'service_rdnprr3',
  emailJsTemplateId: 'template_id9taaq',
  emailJsPublicKey: 'kjys0AoHlrgGfDVrZ',
  
  // Blog Configuration
  blog: {
    enabled: true,
    postsPerPage: 6,
    enableComments: false,
    enableSearch: true,
    contentPath: '/assets/blog/'
  },
  
  // Admin Configuration
  admin: {
    enabled: true,
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    passwordHash: 'dev-password-hash' // Replace with actual hash in production
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
    siteUrl: 'http://localhost:4200',
    defaultImage: '/assets/img/og-image.jpg',
    twitterHandle: '@miguel_dev'
  },
  
  // API Endpoints
  api: {
    baseUrl: 'http://localhost:8000/api/v1',
    timeout: 10000
  }
};
