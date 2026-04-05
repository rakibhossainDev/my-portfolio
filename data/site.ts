import { RESUME_HREF } from "@/lib/resume";

/**
 * Static marketing copy & contact fields for the landing page.
 * Hero role, bio, stats, about body, skills, and education are overridden by `SiteDataProvider` when present.
 */
export const site = {
  hero: {
    badge: "Flutter app developer",
    greeting: "Hi, I'm",
    name: "MD RAKIB HOSSAIN",
    role: "Flutter App Developer",
    bio: "I'm MD RAKIB HOSSAIN — a Flutter app developer focused on beautiful, high-performance Android & iOS experiences. I turn product ideas into polished cross-platform apps users enjoy every day.",
    hireMeUrl: "https://wa.me/8801575809072",
    resumeUrl: RESUME_HREF,
  },
  stats: [
    { value: "4", suffix: "y+", label: "Experience" },
    { value: "50", suffix: "+", label: "Projects" },
    { value: "45", suffix: "+", label: "Happy Clients" },
  ],
  about: {
    /** Served from `public/profile.jpg` (e.g. `/home/.../public/profile.jpg` on disk) */
    profileImage: "/profile.jpg",
    name: "MD RAKIB HOSSAIN",
    title: "Flutter App Developer",
    location: "Khilkhet, Dhaka, Bangladesh",
    email: "mail@rakibhossain.me",
    credential: "Diploma in CST",
    journey: `I'm MD RAKIB HOSSAIN, a Flutter app developer and aspiring software engineer. My journey is defined by curiosity for technology and a drive to solve real-world problems through code. I specialize in elegant, high-performance mobile applications that look great and feel amazing to use.`,
    goalTitle: "My Goal",
    goal: "My ultimate goal is to become a world-class software engineer, contributing to impactful projects that change lives. I aim to master full-stack mobile development and keep shipping polished Flutter products.",
    visionTitle: "My Vision",
    vision: "To create digital solutions that make a real difference in people's lives.",
  },
  contact: {
    heading: "Get In Touch",
    sub: "Have a project in mind or just want to say hi? I'd love to hear from you.",
    location: "Khilkhet, Dhaka, Bangladesh",
    email: "mail@rakibhossain.me",
    phone: "+88 01580995152",
  },
  social: {
    github: "https://github.com/rakibhossainDev",
    linkedin: "https://www.linkedin.com/in/rakibhossaindev/",
    facebook: "https://facebook.com/rakibhossainDev",
  },
  /** Footer “Connect With Me” — @rakibhossainDev */
  connect: {
    youtube: "https://www.youtube.com/@rakibhossainDev",
    discord: "https://discord.gg/rakibhossainDev",
    x: "https://x.com/rakibhossainDev",
    instagram: "https://www.instagram.com/rakibhossainDev/",
    facebook: "https://facebook.com/rakibhossainDev",
    github: "https://github.com/rakibhossainDev",
    telegram: "https://t.me/rakibhossainDev",
    linkedin: "https://www.linkedin.com/in/rakibhossainDev/",
    whatsapp: "https://wa.me/8801575809072",
  },
} as const;
