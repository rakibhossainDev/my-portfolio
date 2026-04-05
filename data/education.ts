/**
 * Education timeline entries (About → Education tab).
 * TODO: Supabase `education` table if you need non-dev edits.
 */
export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  detail: string;
};

export const education: EducationEntry[] = [
  {
    id: "e1",
    degree: "Diploma in Computer Science & Technology",
    institution: "Your Polytechnic Institute",
    period: "2021 — 2025",
    detail: "Software engineering fundamentals, data structures, and mobile-focused projects.",
  },
  {
    id: "e2",
    degree: "Secondary School Certificate (SSC)",
    institution: "Your High School",
    period: "2019 — 2021",
    detail: "Business Studies group with accounting, finance, and commerce foundation.",
  },
];
