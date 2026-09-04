import NavBar from "@/components/NavBar";
import HeroSection from "@/components/Hero/HeroSection";
import AboutSection from "@/components/About/AboutSection";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import ProcessSection from "@/components/Process/ProcessSection";
import SkillsSection from "@/components/Skills/SkillsSection";
import ContactSection from "@/components/Contact/ContactSection";
import Footer from "@/components/Footer";
import { ProjectModalProvider } from "@/components/Projects/ProjectModalProvider";

/**
 * Six sections, and the rhythm between them is deliberately uneven:
 *
 *   home     full viewport, ground plane, bleeds edge to edge
 *   about    slab on `surface`, 92rem, two columns with a sticky sidebar
 *   projects ground plane, pinned horizontal track (stacked below `lg`)
 *   process  slab on `surface`, NARROW (5xl), single centred column
 *   skills   ground plane, 6xl, an interactive shell
 *   contact  slab on `surface`, 92rem, form on the right
 *
 * Neighbouring sections never share both a measure and a ground. Five
 * sections on one `py-24 max-w-7xl` template under a shared heading component
 * is the single strongest tell that a page was generated rather than
 * designed, which is also why there is no <SectionHeading>: each section
 * writes its own h2 at its own size.
 *
 * The section ids are a contract with NavBar's LINK_IDS and with
 * smoothScrollTo. Renaming one here does not throw; it silently stops the
 * scroll-spy from ever selecting that tab.
 *
 * ProjectModalProvider wraps everything because two different places open a
 * project: the projects track, and the third hero laptop, whose screen cycles
 * real screenshots and is a shortcut into that project.
 */
export default function Home() {
  return (
    <ProjectModalProvider>
      <NavBar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ProcessSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </ProjectModalProvider>
  );
}
