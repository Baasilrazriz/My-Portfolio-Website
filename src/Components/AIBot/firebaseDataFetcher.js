import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

// Cache for Firebase data to avoid repeated API calls
const dataCache = {
  projects: { data: null, timestamp: null, ttl: 5 * 60 * 1000 }, // 5 minutes TTL
  certificates: { data: null, timestamp: null, ttl: 5 * 60 * 1000 }
};

// Check if cached data is still valid
const isCacheValid = (cacheEntry) => {
  return cacheEntry.data && 
         cacheEntry.timestamp && 
         (Date.now() - cacheEntry.timestamp) < cacheEntry.ttl;
};

// Fetch projects from Firebase
export const fetchProjectsData = async () => {
  try {
    // Check cache first
    if (isCacheValid(dataCache.projects)) {
      return dataCache.projects.data;
    }

    console.log('Fetching projects from Firebase...');
    const projectsRef = collection(db, 'portfolio', 'projects', 'items');
    const projectsQuery = query(projectsRef, orderBy('createdAt', 'desc'));
    const projectsSnapshot = await getDocs(projectsQuery);
    
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Update cache
    dataCache.projects = {
      data: projects,
      timestamp: Date.now()
    };

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Fetch certificates from Firebase
export const fetchCertificatesData = async () => {
  try {
    // Check cache first
    if (isCacheValid(dataCache.certificates)) {
      return dataCache.certificates.data;
    }

    console.log('Fetching certificates from Firebase...');
      const certificatesRef = collection(db, 'portfolio', 'certificates', 'items');
    const certificatesQuery = query(certificatesRef, orderBy('dateEarned', 'desc'));
    const certificatesSnapshot = await getDocs(certificatesQuery);
    
    const certificates = certificatesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Update cache
    dataCache.certificates = {
      data: certificates,
      timestamp: Date.now()
    };

    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

// Get summary stats from projects and certificates
export const getProjectStats = (projects) => {
  if (!projects || projects.length === 0) return null;
  
  const stats = {
    total: projects.length,
    categoriesCount: [...new Set(projects.map(p => p.category))].length,
    recentCount: projects.filter(p => {
      const createdAt = p.createdAt?.toDate?.() || new Date(p.createdAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return createdAt >= sixMonthsAgo;
    }).length,
    featured: projects.filter(p => p.featured).length,
    technologies: [...new Set(projects.flatMap(p => p.technologies || []))],
    categories: projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {})
  };
  
  return stats;
};

export const getCertificateStats = (certificates) => {
  if (!certificates || certificates.length === 0) return null;
  
  const stats = {
    total: certificates.length,
    categoriesCount: [...new Set(certificates.map(c => c.category))].length,
    recentCount: certificates.filter(c => {
      const dateEarned = c.dateEarned?.toDate?.() || new Date(c.dateEarned);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return dateEarned >= oneYearAgo;
    }).length,
    providers: [...new Set(certificates.map(c => c.provider))],
    categories: certificates.reduce((acc, cert) => {
      acc[cert.category] = (acc[cert.category] || 0) + 1;
      return acc;
    }, {})
  };
  
  return stats;
};

// Format project data for AI context
export const formatProjectsForAI = (projects) => {
  if (!projects || projects.length === 0) {
    return "No projects data available.";
  }

  const stats = getProjectStats(projects);
  const recentProjects = projects.slice(0, 5); // Top 5 most recent
  
  let formatted = `\n🚀 PROJECTS OVERVIEW:\n`;
  formatted += `Total Projects: ${stats.total}\n`;
  formatted += `Categories: ${Object.entries(stats.categories).map(([cat, count]) => `${cat} (${count})`).join(', ')}\n`;
  formatted += `Recent Projects (6 months): ${stats.recentCount}\n`;
  formatted += `Featured Projects: ${stats.featured}\n`;
  formatted += `Technologies Used: ${stats.technologies.slice(0, 10).join(', ')}${stats.technologies.length > 10 ? '...' : ''}\n\n`;
  
  formatted += `📋 RECENT PROJECTS:\n`;
  recentProjects.forEach((project, index) => {
    formatted += `${index + 1}. ${project.title}\n`;
    formatted += `   Category: ${project.category}\n`;
    formatted += `   Description: ${project.description?.substring(0, 100)}...\n`;
    formatted += `   Technologies: ${project.technologies?.join(', ') || 'Not specified'}\n`;
    if (project.liveUrl) formatted += `   Live URL: ${project.liveUrl}\n`;
    if (project.githubUrl) formatted += `   GitHub: ${project.githubUrl}\n`;
    formatted += `   ${project.featured ? '⭐ Featured Project' : ''}\n\n`;
  });
  
  return formatted;
};

// Format certificate data for AI context
export const formatCertificatesForAI = (certificates) => {
  if (!certificates || certificates.length === 0) {
    return "No certificates data available.";
  }

  const stats = getCertificateStats(certificates);
  const recentCertificates = certificates.slice(0, 5); // Top 5 most recent
  
  let formatted = `\n🏆 CERTIFICATES OVERVIEW:\n`;
  formatted += `Total Certificates: ${stats.total}\n`;
  formatted += `Categories: ${Object.entries(stats.categories).map(([cat, count]) => `${cat} (${count})`).join(', ')}\n`;
  formatted += `Recent Certificates (1 year): ${stats.recentCount}\n`;
  formatted += `Providers: ${stats.providers.join(', ')}\n\n`;
  
  formatted += `📜 RECENT CERTIFICATES:\n`;
  recentCertificates.forEach((cert, index) => {
    const dateEarned = cert.dateEarned?.toDate?.() || new Date(cert.dateEarned);
    formatted += `${index + 1}. ${cert.title}\n`;
    formatted += `   Category: ${cert.category}\n`;
    formatted += `   Provider: ${cert.provider}\n`;
    formatted += `   Date Earned: ${dateEarned.toLocaleDateString()}\n`;
    if (cert.description) formatted += `   Description: ${cert.description.substring(0, 100)}...\n`;
    if (cert.skills) formatted += `   Skills: ${cert.skills.join(', ')}\n`;
    formatted += `\n`;
  });
  
  return formatted;
};

// Main function to get enhanced context for AI
export const getEnhancedAIContext = async (userQuestion) => {
  const questionLower = userQuestion.toLowerCase();
  let enhancedContext = "";
  
  // Check if question is about projects
  const isAboutProjects = questionLower.includes('project') || 
                         questionLower.includes('work') || 
                         questionLower.includes('portfolio') ||
                         questionLower.includes('built') ||
                         questionLower.includes('created') ||
                         questionLower.includes('developed');
  
  // Check if question is about certificates/education
  const isAboutCertificates = questionLower.includes('certificate') || 
                             questionLower.includes('certification') || 
                             questionLower.includes('education') ||
                             questionLower.includes('course') ||
                             questionLower.includes('learning') ||
                             questionLower.includes('skill');

  try {
    if (isAboutProjects) {
      const projects = await fetchProjectsData();
      enhancedContext += formatProjectsForAI(projects);
    }

    if (isAboutCertificates) {
      const certificates = await fetchCertificatesData();
      enhancedContext += formatCertificatesForAI(certificates);
    }

    // If question seems to be asking for general overview, include both
    const isGeneralQuery = questionLower.includes('tell me about') ||
                          questionLower.includes('what do you') ||
                          questionLower.includes('overview') ||
                          questionLower.includes('experience') ||
                          questionLower.includes('background');

    if (isGeneralQuery && !isAboutProjects && !isAboutCertificates) {
      const [projects, certificates] = await Promise.all([
        fetchProjectsData(),
        fetchCertificatesData()
      ]);
      enhancedContext += formatProjectsForAI(projects);
      enhancedContext += formatCertificatesForAI(certificates);
    }

  } catch (error) {
    console.error('Error fetching enhanced context:', error);
    enhancedContext += "\n[Note: Unable to fetch latest projects and certificates data. Using basic profile information.]\n";
  }

  return enhancedContext;
};

// Clear cache function (useful for testing or manual refresh)
export const clearDataCache = () => {
  dataCache.projects = { data: null, timestamp: null, ttl: 5 * 60 * 1000 };
  dataCache.certificates = { data: null, timestamp: null, ttl: 5 * 60 * 1000 };
};
