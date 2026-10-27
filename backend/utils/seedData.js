const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect_db';
    await mongoose.connect(mongoUri);
    console.log(`[Seed Data] Connected to MongoDB: ${mongoUri}`);

    // Clear existing collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('[Seed Data] Cleared existing users, jobs, and applications.');

    // Create Sample PDF resume in uploads/resumes
    const resumeDir = path.join(__dirname, '..', 'uploads', 'resumes');
    if (!fs.existsSync(resumeDir)) {
      fs.mkdirSync(resumeDir, { recursive: true });
    }
    const sampleResumeFilename = 'sample-candidate-resume.pdf';
    const sampleResumePath = path.join(resumeDir, sampleResumeFilename);
    const minimalPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >>\nendobj\n4 0 obj\n<< /Length 55 >>\nstream\nBT /F1 24 Tf 100 700 Td (CareerConnect Candidate Resume Sample) ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000224 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n329\n%%EOF'
    );
    fs.writeFileSync(sampleResumePath, minimalPdf);

    // 1. Create Users
    // Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@careerconnect.com',
      password: 'AdminPassword@123',
      role: 'admin',
      phone: '+1 800-555-0199',
      title: 'Platform Operations Lead',
      company: 'CareerConnect Technologies',
    });

    // Employers
    const employer1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@cloudscale.io',
      password: 'EmployerPassword@123',
      role: 'employer',
      phone: '+1 415-555-0142',
      title: 'Director of Talent Acquisition',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      bio: 'Leading high-growth cloud architecture and developer tools hiring across North America and remote.',
    });

    const employer2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@luminahealth.com',
      password: 'EmployerPassword@123',
      role: 'employer',
      phone: '+1 212-555-0188',
      title: 'Head of People & Culture',
      company: 'Lumina Digital Health',
      location: 'New York, NY',
      bio: 'Building revolutionary digital health solutions connecting patients and providers seamlessly.',
    });

    // Candidates
    const candidate1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: 'CandidatePassword@123',
      role: 'candidate',
      phone: '+1 650-555-0112',
      title: 'Full Stack JavaScript Engineer',
      location: 'Austin, TX',
      bio: 'Passionate developer with 3+ years building responsive SPAs with React, Node.js, Express, and MongoDB.',
      skills: ['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'REST APIs', 'Docker'],
      experienceYears: 3,
    });

    const candidate2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.ui@example.com',
      password: 'CandidatePassword@123',
      role: 'candidate',
      phone: '+1 206-555-0177',
      title: 'Senior Product Designer',
      location: 'Seattle, WA',
      bio: 'Human-centered designer crafting accessible, elegant SaaS dashboards and mobile applications.',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
      experienceYears: 5,
    });

    console.log('[Seed Data] Users created: Admin, 2 Employers, 2 Candidates.');

    // 2. Create Jobs
    const jobs = await Job.create([
      {
        title: 'Senior Full Stack Engineer (MERN)',
        company: 'CloudScale Technologies',
        description:
          'We are seeking an experienced Full Stack Developer to lead the engineering of our enterprise cloud monitoring dashboard. You will design scalable REST APIs, optimize MongoDB aggregation queries, and build responsive interfaces with React.',
        location: 'Remote / US',
        employmentType: 'Full-time',
        salaryRange: '$125,000 - $155,000 / year',
        category: 'Technology & IT',
        requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'System Architecture'],
        experienceLevel: 'Senior Level',
        employer: employer1._id,
        status: 'approved',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        requirements: [
          '5+ years of software development experience',
          'Deep expertise in modern React and Node.js microservices',
          'Demonstrated knowledge of database indexing and query optimization',
        ],
        responsibilities: [
          'Architect and deliver end-to-end features for core platform',
          'Collaborate with product and design teams in rapid 2-week agile sprints',
          'Mentor junior and mid-level engineering team members',
        ],
      },
      {
        title: 'Lead UI/UX Product Designer',
        company: 'CloudScale Technologies',
        description:
          'CloudScale is looking for a creative Lead Product Designer to guide the user experience across web and mobile cloud analytics products. You will build comprehensive design systems and deliver intuitive workflows.',
        location: 'San Francisco, CA (Hybrid)',
        employmentType: 'Full-time',
        salaryRange: '$110,000 - $140,000 / year',
        category: 'Design & Creative',
        requiredSkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
        experienceLevel: 'Lead / Manager',
        employer: employer1._id,
        status: 'approved',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        requirements: [
          'Demonstrated portfolio showing complex SaaS web application UX',
          'Proficiency with Figma tokens and modern component libraries',
          'Experience running usability tests with enterprise stakeholders',
        ],
        responsibilities: [
          'Own the global CareerConnect and CloudScale design language',
          'Conduct user interviews and synthesize actionable insights',
        ],
      },
      {
        title: 'Full Stack Healthcare Software Developer',
        company: 'Lumina Digital Health',
        description:
          'Join Lumina to modernize patient health records and telemedicine video consults. You will work on HIPAA-compliant web services and rich React interactive dashboards.',
        location: 'New York, NY / Remote',
        employmentType: 'Full-time',
        salaryRange: '$95,000 - $120,000 / year',
        category: 'Healthcare',
        requiredSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Data Security'],
        experienceLevel: 'Mid Level',
        employer: employer2._id,
        status: 'approved',
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        requirements: [
          '3+ years full-stack web engineering experience',
          'Understanding of secure data transmission and token authentication',
        ],
        responsibilities: [
          'Build secure patient portals and doctor schedule dashboards',
          'Write clean unit tests and API integration suites',
        ],
      },
      {
        title: 'Growth Marketing & Brand Specialist',
        company: 'Lumina Digital Health',
        description:
          'Drive organic customer acquisition and employer partnerships through content marketing, SEO campaigns, and email automation.',
        location: 'New York, NY',
        employmentType: 'Contract',
        salaryRange: '$60,000 - $75,000 / year',
        category: 'Sales & Marketing',
        requiredSkills: ['SEO', 'Content Strategy', 'Google Analytics', 'Copywriting'],
        experienceLevel: 'Mid Level',
        employer: employer2._id,
        status: 'approved',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Junior Frontend Developer (React/Vite)',
        company: 'CloudScale Technologies',
        description:
          'Ideal position for an ambitious junior developer eager to build production React components, hook into REST APIs, and master modern frontend design.',
        location: 'Remote',
        employmentType: 'Internship',
        salaryRange: '$40,000 - $55,000 / year',
        category: 'Technology & IT',
        requiredSkills: ['JavaScript ES6+', 'React.js', 'CSS3', 'Git', 'HTML5'],
        experienceLevel: 'Entry Level',
        employer: employer1._id,
        status: 'pending', // PENDING ADMIN APPROVAL
        applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Financial Data & Compliance Analyst',
        company: 'Lumina Digital Health',
        description:
          'Monitor health plan insurance billing models, create audit reports, and partner with finance leadership on annual forecasts.',
        location: 'Chicago, IL',
        employmentType: 'Full-time',
        salaryRange: '$85,000 - $105,000 / year',
        category: 'Finance & Accounting',
        requiredSkills: ['Financial Modeling', 'Excel', 'SQL', 'Auditing'],
        experienceLevel: 'Mid Level',
        employer: employer2._id,
        status: 'pending', // PENDING ADMIN APPROVAL
      },
    ]);

    console.log(`[Seed Data] Created ${jobs.length} jobs (4 approved, 2 pending).`);

    // 3. Create Sample Applications
    await Application.create([
      {
        job: jobs[0]._id, // Senior Full Stack Engineer
        candidate: candidate1._id,
        resume: sampleResumeFilename,
        resumeOriginalName: 'Alex_Rivera_Resume.pdf',
        resumeSize: minimalPdf.length,
        coverLetter:
          'Dear CloudScale Hiring Team,\n\nI am writing to express my strong enthusiasm for the Senior Full Stack Engineer position. Having built multiple production MERN applications with real-time analytics, I am confident in my ability to deliver immediate value to your platform.\n\nBest regards,\nAlex Rivera',
        status: 'shortlisted',
        feedback: 'Impressive MERN project background. Scheduled for technical interview.',
      },
      {
        job: jobs[1]._id, // Lead UI/UX Product Designer
        candidate: candidate2._id,
        resume: sampleResumeFilename,
        resumeOriginalName: 'Elena_Rostova_Design_CV.pdf',
        resumeSize: minimalPdf.length,
        coverLetter:
          'Hello CloudScale Design Team,\n\nI have specialized in enterprise design systems and SaaS data visualization for over five years. I would love to bring my expertise to CloudScale.\n\nWarmly,\nElena Rostova',
        status: 'pending',
      },
      {
        job: jobs[2]._id, // Full Stack Healthcare
        candidate: candidate1._id,
        resume: sampleResumeFilename,
        resumeOriginalName: 'Alex_Rivera_Resume.pdf',
        resumeSize: minimalPdf.length,
        coverLetter:
          'Greetings Lumina Health,\n\nI am thrilled about the opportunity to build HIPAA-compliant digital tools that improve patient outcomes. My background with secure JWT architectures and React makes me a great fit.',
        status: 'reviewed',
      },
    ]);

    console.log('[Seed Data] Created 3 sample applications.');

    console.log('\n=============================================================');
    console.log('      CAREERCONNECT SAMPLE SEED DATA COMPLETED');
    console.log('=============================================================');
    console.log('ADMIN ACCOUNT:');
    console.log('  Email:    admin@careerconnect.com');
    console.log('  Password: AdminPassword@123');
    console.log('  Role:     admin\n');
    console.log('EMPLOYER ACCOUNTS:');
    console.log('  1) sarah@cloudscale.io / EmployerPassword@123');
    console.log('  2) marcus@luminahealth.com / EmployerPassword@123\n');
    console.log('CANDIDATE ACCOUNTS:');
    console.log('  1) alex.rivera@example.com / CandidatePassword@123');
    console.log('  2) elena.ui@example.com / CandidatePassword@123');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Data Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
