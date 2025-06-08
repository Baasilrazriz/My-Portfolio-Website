/* eslint-disable react/prop-types */
import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLoader from '../Loaders/MainLoader';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load all sections efficiently
const sections = {
  NavbarSection: lazy(() => import('../Sections/NavbarSection')),
  HomeSection: lazy(() => import('../Sections/HomeSection')),
  AboutSection: lazy(() => import('../Sections/AboutSection')),
  EducationSection: lazy(() => import('../Sections/EducationSection')),
  ServicesSection: lazy(() => import('../Sections/ServicesSection')),
  SkillsSection: lazy(() => import('../Sections/SkillsSection')),
  CertificateSection: lazy(() => import('../Sections/CertificateSection')),
  ProjectSection: lazy(() => import('../Sections/ProjectSection')),
  ContactSection: lazy(() => import('../Sections/ContactSection')),
  FooterSection: lazy(() => import('../Sections/FooterSection')),
};

function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Error fallback component
  const ErrorFallback = ({ error }) => {
    useEffect(() => {
      // Log error for debugging
      console.error('Portfolio Page Error:', error);
      
      // Redirect to error page after a short delay
      const redirectTimer = setTimeout(() => {
        navigate('/error', { 
          state: { 
            error: error.message,
            from: '/' 
          }
        });
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }, [error]);

    // Show a brief loading state before redirect
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Something went wrong...</div>
          <div className="text-slate-500 text-sm">Redirecting to error page...</div>
        </div>
      </div>
    );
  };

  // Memoize section components to prevent unnecessary re-renders
  const SectionComponents = useMemo(() => {
    const {
      NavbarSection,
      HomeSection,
      AboutSection,
      EducationSection,
      SkillsSection,
      ServicesSection,
      CertificateSection,
      ProjectSection,
      ContactSection,
      FooterSection,
    } = sections;

    return (
      <div className="w-full min-h-screen dark:bg-slate-950 bg-slate-100 text-slate-900 dark:text-slate-200">
        <NavbarSection />
        <HomeSection />
        <AboutSection />
        <ServicesSection />
        <EducationSection />
        <CertificateSection />
        <SkillsSection />
        <ProjectSection />
        <ContactSection />
        <FooterSection />
      </div>
    );
  }, []);

  // Show loader during initial loading
  if (loading) {
    return <MainLoader />;
  }

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
      }}
      onReset={() => {
        // Reset any state if needed
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      }}
    >
      <Suspense fallback={<MainLoader />}>
        {SectionComponents}
      </Suspense>
    </ErrorBoundary>
  );
}

export default PortfolioPage;