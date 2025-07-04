import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEOManager = ({ 
  title = "Basil Razriz | Top Karachi Software Engineer | Freelancer | MERN Stack Developer",
  description = "Basil Razriz (Muhammad Basil Irfan) - Leading software engineer in Karachi, Pakistan. Expert freelancer specializing in MERN stack, React.js, Node.js. Hire top-rated developer for web development projects",
  keywords = "Basil, Razriz, Basil Razriz, Muhammad Basil Irfan, Karachi software engineer, freelancer, MERN stack developer, React.js developer Karachi, Node.js expert Pakistan",
  url = "https://baasilrazriz.tech/",
  image = "https://baasilrazriz.tech/bas.png",
  type = "website",
  section = ""
}) => {
  const currentUrl = section ? `${url}#${section}` : url;
  const sectionTitle = section ? `${title} | ${section}` : title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{sectionTitle}</title>
      <meta name="title" content={sectionTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={sectionTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Basil Razriz Portfolio" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={sectionTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@baasilrazriz" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Additional SEO Tags */}
      <meta name="author" content="Basil Razriz - Muhammad Basil Irfan" />
      <meta name="geo.region" content="PK-SD" />
      <meta name="geo.placename" content="Karachi, Pakistan" />
      <meta name="location" content="Karachi, Sindh, Pakistan" />
    </Helmet>
  );
};

SEOManager.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  section: PropTypes.string
};

export default SEOManager;
