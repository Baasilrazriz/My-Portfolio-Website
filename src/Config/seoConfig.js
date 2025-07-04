// SEO Configuration for Basil Razriz Portfolio
export const seoConfig = {
  // Primary keywords for ranking
  primaryKeywords: [
    "Basil",
    "Razriz", 
    "Basil Razriz",
    "Muhammad Basil Irfan",
    "Karachi software engineer",
    "freelancer",
    "MERN stack developer",
    "React.js developer Karachi",
    "Node.js expert Pakistan"
  ],

  // Long-tail keywords for specific searches
  longTailKeywords: [
    "hire software engineer Karachi",
    "freelance developer Pakistan", 
    "MERN stack specialist Karachi",
    "React.js expert freelancer",
    "Node.js developer for hire",
    "full stack developer Karachi",
    "web development services Pakistan",
    "top software engineer Karachi",
    "best freelancer Pakistan",
    "professional web developer Karachi"
  ],

  // Geographic targeting
  geographic: {
    country: "Pakistan",
    region: "Sindh", 
    city: "Karachi",
    coordinates: {
      latitude: 24.8607,
      longitude: 67.0011
    }
  },

  // Social media profiles
  socialProfiles: {
    github: "https://github.com/baasilrazriz",
    linkedin: "https://linkedin.com/in/baasilrazriz", 
    twitter: "https://twitter.com/baasilrazriz"
  },

  // Default meta information
  defaultMeta: {
    title: "Basil Razriz | Top Karachi Software Engineer | Expert Freelancer | MERN Stack Developer",
    description: "Basil Razriz (Muhammad Basil Irfan) - Leading software engineer and freelancer in Karachi, Pakistan. Expert in MERN stack, React.js, Node.js. Hire top-rated developer for web development projects.",
    image: "https://baasilrazriz.tech/bas.png",
    url: "https://baasilrazriz.tech/"
  },

  // Page-specific SEO configurations
  pages: {
    home: {
      title: "Basil Razriz | Top Karachi Software Engineer | Expert Freelancer",
      description: "Basil Razriz - Leading software engineer and freelancer in Karachi, Pakistan. Expert in MERN stack, React.js, Node.js. Available for hire for web development projects.",
      keywords: "Basil, Razriz, Karachi software engineer, freelancer, MERN stack developer, React.js developer, Node.js expert, hire developer Karachi"
    },
    about: {
      title: "About Basil Razriz | Professional Software Engineer from Karachi",
      description: "Learn about Basil Razriz, a professional software engineer and freelancer from Karachi, Pakistan. Expert in MERN stack development with years of experience.",
      keywords: "About Basil Razriz, software engineer background, Karachi developer, freelancer experience, MERN stack expert"
    },
    portfolio: {
      title: "Portfolio | Basil Razriz Projects | MERN Stack Developer Work",
      description: "Explore the portfolio of Basil Razriz featuring professional web development projects, MERN stack applications, and client work from Karachi, Pakistan.",
      keywords: "Basil Razriz portfolio, MERN stack projects, web development work, Karachi developer projects, freelancer portfolio"
    },
    services: {
      title: "Services | Freelance Web Development by Basil Razriz Karachi",
      description: "Professional web development services by Basil Razriz in Karachi. MERN stack development, React.js, Node.js, and full-stack solutions for businesses.",
      keywords: "web development services Karachi, freelance developer, MERN stack services, React.js development, Node.js services"
    },
    contact: {
      title: "Contact Basil Razriz | Hire Software Engineer in Karachi",
      description: "Contact Basil Razriz for professional software development services in Karachi, Pakistan. Available for freelance projects and full-stack development work.",
      keywords: "contact Basil Razriz, hire developer Karachi, freelance software engineer, MERN stack developer contact"
    }
  },

  // Structured data templates
  structuredData: {
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Muhammad Basil Irfan",
      alternateName: ["Basil Irfan", "Basil Razriz", "Basil"],
      url: "https://baasilrazriz.tech/",
      image: "https://baasilrazriz.tech/bas.png",
      jobTitle: [
        "Software Engineer",
        "Freelance Developer", 
        "MERN Stack Developer",
        "Full Stack Developer"
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        addressCountry: "Pakistan"
      }
    }
  }
};

export default seoConfig;
