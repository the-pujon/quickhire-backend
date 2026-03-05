import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { Job } from "./app/modules/Job/job.model";

const seedJobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    category: "Technology",
    type: "Full-Time",
    description:
      "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user-facing features using React.js and Next.js. The ideal candidate has 5+ years of experience in frontend development and a strong understanding of modern web technologies.",
    requirements: [
      "5+ years of React.js experience",
      "Experience with Next.js and TypeScript",
      "Strong CSS/Tailwind skills",
      "Knowledge of state management (Redux/Zustand)",
      "Experience with REST APIs and GraphQL",
    ],
    salary: "$120,000 - $160,000",
  },
  {
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "New York, NY",
    category: "Engineering",
    type: "Full-Time",
    description:
      "Join our backend engineering team to build scalable APIs and microservices. You will work with Node.js, Express, and MongoDB to deliver high-performance backend solutions for our growing platform.",
    requirements: [
      "3+ years of Node.js experience",
      "Experience with MongoDB or PostgreSQL",
      "Knowledge of Docker and Kubernetes",
      "Understanding of microservices architecture",
      "Familiarity with CI/CD pipelines",
    ],
    salary: "$110,000 - $150,000",
  },
  {
    title: "UI/UX Designer",
    company: "CreativeMinds Agency",
    location: "Los Angeles, CA",
    category: "Design",
    type: "Full-Time",
    description:
      "We are seeking a talented UI/UX Designer to create beautiful and intuitive user interfaces. You will collaborate with product managers and engineers to design user-centered experiences across web and mobile platforms.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio demonstrating design thinking",
      "Experience with design systems",
      "Knowledge of accessibility standards",
    ],
    salary: "$90,000 - $130,000",
  },
  {
    title: "Digital Marketing Manager",
    company: "GrowthHackers Co.",
    location: "Austin, TX",
    category: "Marketing",
    type: "Full-Time",
    description:
      "Lead our digital marketing efforts across multiple channels including SEO, SEM, social media, and email marketing. You will develop and execute marketing strategies to drive brand awareness and customer acquisition.",
    requirements: [
      "4+ years of digital marketing experience",
      "Experience with Google Analytics and Ads",
      "Strong content creation skills",
      "Knowledge of SEO best practices",
      "Data-driven decision making",
    ],
    salary: "$85,000 - $120,000",
  },
  {
    title: "Business Analyst",
    company: "StrategyPlus Consulting",
    location: "Chicago, IL",
    category: "Business",
    type: "Full-Time",
    description:
      "We need a Business Analyst to bridge the gap between business needs and technology solutions. You will gather requirements, create documentation, and work closely with stakeholders to deliver successful projects.",
    requirements: [
      "3+ years of business analysis experience",
      "Strong communication and presentation skills",
      "Experience with Agile/Scrum methodologies",
      "Proficiency in JIRA and Confluence",
      "SQL knowledge is a plus",
    ],
    salary: "$80,000 - $110,000",
  },
  {
    title: "Financial Analyst",
    company: "WealthBridge Capital",
    location: "Boston, MA",
    category: "Finance",
    type: "Full-Time",
    description:
      "Join our finance team to analyze financial data, create forecasts, and provide strategic recommendations. You will work with senior management to drive data-informed financial decisions.",
    requirements: [
      "2+ years of financial analysis experience",
      "Advanced Excel and financial modeling skills",
      "Experience with Bloomberg Terminal",
      "CFA Level 1 or progress toward CFA",
      "Strong analytical and problem-solving skills",
    ],
    salary: "$75,000 - $100,000",
  },
  {
    title: "React Native Developer",
    company: "MobileFirst Labs",
    location: "Seattle, WA",
    category: "Technology",
    type: "Remote",
    description:
      "Build cross-platform mobile applications using React Native. You will develop features, fix bugs, and ensure high performance across iOS and Android platforms for our suite of mobile products.",
    requirements: [
      "3+ years of React Native experience",
      "Published apps on App Store and Google Play",
      "Experience with native modules",
      "Knowledge of mobile UI/UX patterns",
      "Experience with Firebase or similar BaaS",
    ],
    salary: "$100,000 - $140,000",
  },
  {
    title: "HR Coordinator",
    company: "PeopleFirst Inc.",
    location: "Denver, CO",
    category: "Human Resource",
    type: "Full-Time",
    description:
      "Support our HR team with recruitment, onboarding, and employee engagement initiatives. You will manage HR operations and help create a positive workplace culture for our growing team.",
    requirements: [
      "2+ years of HR experience",
      "Knowledge of HR software (BambooHR, Workday)",
      "Understanding of employment law basics",
      "Excellent organizational skills",
      "Strong interpersonal communication",
    ],
    salary: "$55,000 - $75,000",
  },
  {
    title: "Sales Representative",
    company: "CloudSales Pro",
    location: "Miami, FL",
    category: "Sales",
    type: "Full-Time",
    description:
      "Drive new business by identifying and closing enterprise sales opportunities. You will manage the full sales cycle from prospecting to closing, working with our SaaS platform for B2B clients.",
    requirements: [
      "2+ years of B2B sales experience",
      "Experience with CRM tools (Salesforce, HubSpot)",
      "Strong negotiation and closing skills",
      "Excellent presentation abilities",
      "Track record of meeting/exceeding quotas",
    ],
    salary: "$60,000 - $90,000 + Commission",
  },
  {
    title: "DevOps Engineer",
    company: "InfraScale Technologies",
    location: "Portland, OR",
    category: "Engineering",
    type: "Remote",
    description:
      "Design and maintain our cloud infrastructure on AWS. You will implement CI/CD pipelines, manage containerized applications, and ensure high availability and security of our production systems.",
    requirements: [
      "4+ years of DevOps experience",
      "AWS/GCP/Azure certification preferred",
      "Experience with Terraform and Ansible",
      "Strong Docker and Kubernetes skills",
      "Knowledge of monitoring tools (Grafana, Prometheus)",
    ],
    salary: "$115,000 - $155,000",
  },
  {
    title: "Content Marketing Specialist",
    company: "ContentCraft Media",
    location: "Remote",
    category: "Marketing",
    type: "Remote",
    description:
      "Create compelling content across blog posts, whitepapers, case studies, and social media. You will develop content strategies that drive organic traffic and support our brand positioning.",
    requirements: [
      "2+ years of content marketing experience",
      "Excellent writing and editing skills",
      "SEO content optimization knowledge",
      "Experience with CMS platforms (WordPress)",
      "Social media management experience",
    ],
    salary: "$55,000 - $80,000",
  },
  {
    title: "Full Stack Developer Intern",
    company: "StartupHub Accelerator",
    location: "San Jose, CA",
    category: "Technology",
    type: "Internship",
    description:
      "Join our 3-month internship program and work on real-world projects. You will learn full-stack development using the MERN stack while being mentored by senior developers.",
    requirements: [
      "Currently enrolled in CS or related degree",
      "Basic knowledge of JavaScript and React",
      "Understanding of REST APIs",
      "Eagerness to learn and grow",
      "Good problem-solving skills",
    ],
    salary: "$25/hour",
  },
];

async function seed() {
  try {
    const dbUrl = process.env.MONGODB_URI;
    if (!dbUrl) {
      console.error("MONGODB_URI is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    // Clear existing jobs
    await Job.deleteMany({});
    console.log("Cleared existing jobs");

    // Insert seed data
    const result = await Job.insertMany(seedJobs);
    console.log(`Seeded ${result.length} jobs successfully`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
