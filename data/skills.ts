import skillsJson from "./skills.json";

/**
 * Skill rows for the About → Skills tab (progress bars).
 * TODO: Optional Supabase table `skills` if you want CMS-driven percentages.
 */
export type SkillRow = {
  name: string;
  percent: number;
};

export const skills: SkillRow[] = skillsJson as SkillRow[];
