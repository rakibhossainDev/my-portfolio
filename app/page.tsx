import { AboutSection } from "@/components/sections/AboutSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";

/**
 * Single-page site — projects (each opens `/projects/[id]`), blog, skills, and contact.
 * CMS from `data/*` + Admin; project stars / blog views & reactions use `localStorage` (see `lib/engagement-storage.ts`).
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturedProjectsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
