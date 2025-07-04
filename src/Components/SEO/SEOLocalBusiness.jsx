import { Helmet } from 'react-helmet-async';

const SEOLocalBusiness = () => {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://baasilrazriz.tech/#localbusiness",
    "name": "Basil Razriz Software Development",
    "alternateName": "Muhammad Basil Irfan Development Services",
    "description": "Professional software development services in Karachi, Pakistan. Expert freelancer specializing in MERN stack, React.js, Node.js, and full-stack web development.",
    "url": "https://baasilrazriz.tech/",
    "telephone": "+92-XXX-XXXXXXX", // Add your actual phone number
    "email": "contact@baasilrazriz.tech", // Add your actual email
    "founder": {
      "@type": "Person",
      "name": "Muhammad Basil Irfan",
      "alternateName": ["Basil Razriz", "Basil"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Karachi",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "postalCode": "75000",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.8607,
      "longitude": 67.0011
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "serviceArea": [
      {
        "@type": "Country",
        "name": "Pakistan"
      },
      {
        "@type": "Place",
        "name": "Worldwide"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "MERN Stack Development",
            "description": "Full-stack web application development using MongoDB, Express.js, React.js, and Node.js"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "React.js Development",
            "description": "Frontend development using React.js and modern JavaScript frameworks"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Node.js Development", 
            "description": "Backend development and API creation using Node.js and Express.js"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Freelance Web Development",
            "description": "Professional freelance web development services for businesses and startups"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "25",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Client Review"
        },
        "reviewBody": "Excellent MERN stack developer. Basil delivered high-quality work on time and exceeded expectations."
      }
    ],
    "sameAs": [
      "https://github.com/baasilrazriz",
      "https://linkedin.com/in/baasilrazriz",
      "https://twitter.com/baasilrazriz"
    ],
    "keywords": [
      "Basil Razriz",
      "Karachi software engineer",
      "freelancer",
      "MERN stack developer",
      "React.js developer Karachi",
      "Node.js expert Pakistan",
      "web development Karachi",
      "software development Pakistan"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessData)}
      </script>
    </Helmet>
  );
};

export default SEOLocalBusiness;
