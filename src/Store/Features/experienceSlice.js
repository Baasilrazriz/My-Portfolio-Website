import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 experienceData:[
  {
    id: 1,
    title: 'Associate Software Engineer',
    company: 'APPTYCOONS',
    location: 'Karachi, Pakistan',
    timestamp: 'Feb 2025 - Present',
    description: 'Associate Software Engineer at Apptycoons, specializing in full-stack web applications using Next.js (TypeScript), Prisma (MongoDB), webhooks, cron jobs, Docker, Amazon EC2, CI/CD pipelines, and payment integrations like Plaid, Dwolla, and Stripe.',
    image: 'https://res.cloudinary.com/dtgdm5jmv/image/upload/v1751127853/apptycoons_p5yctt.png',
    website: 'https://www.apptycoons.com',
    skills: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Docker', 'AWS EC2', 'Webhooks', 'Cron Jobs', 'Plaid', 'Dwolla', 'Stripe', 'TRPC Router'],
    type: 'Current Position',
    duration: '5+ months',
    achievements: [
      'Built secure, scalable full-stack applications',
      'Integrated payment systems (Plaid, Dwolla, Stripe)',
      'Implemented CI/CD pipelines and Docker deployment'
    ]
  },
  {
    id: 2,
    title: 'Software Engineer',
    company: 'SIGNAXES',
    location: 'Karachi, Pakistan',
    timestamp: 'Jul 2024 - Feb 2025',
    website: 'https://www.signaxes.com',
    description: 'Developed .NET applications, managed SQL databases, and built secure authentication systems. Contributed to an AI-powered Textile Fault Detection System with features like scatter plot visualization and batch management.',
    image: 'https://res.cloudinary.com/dtgdm5jmv/image/upload/v1751127853/singaxes_a8onwx.jpg',
    skills: ['.NET', 'ASP.NET', 'SQL Server', 'C#', 'Authentication Systems', 'AI Integration', 'Data Visualization', 'Authorize.Net'],
    type: 'Professional',
    duration: '8 months',
    achievements: [
      'Developed secure .NET applications',
      'Built AI-powered Textile Fault Detection System',
      'Implemented robust SQL database management'
    ]
  }
 ]
};

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    // You can add reducers here if needed for dynamic updates
  },
});

// export const {} = experienceSlice.actions; // No actions needed for now
export default experienceSlice.reducer;
