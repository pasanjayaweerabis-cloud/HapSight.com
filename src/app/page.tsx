import { Hero } from "@/components/sections/Hero";
import { Explore } from "@/components/sections/Explore";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Design } from "@/components/sections/Design";
import { Gallery } from "@/components/sections/Gallery";
import { Demo } from "@/components/sections/Demo";
import { InsideArms } from "@/components/sections/InsideArms";
import { StageHost } from "@/components/visuals/StageHost";
import { JsonLd } from "@/components/layout/JsonLd";
import { Roadmap } from "@/components/sections/Roadmap";
import { Audience } from "@/components/sections/Audience";
import { Comparison } from "@/components/sections/Comparison";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { Waitlist } from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <JsonLd />
      <StageHost />
      <Hero />
      <Explore />
      <Problem />
      <HowItWorks />
      <Features />
      <Design />
      <InsideArms />
      <Gallery />
      <Roadmap />
      {/* visible hand-over from the always-dark stage to the page's own theme */}
      <div
        aria-hidden="true"
        className="h-24"
        style={{ background: "linear-gradient(to bottom, var(--stage-bg), var(--bg))" }}
      />
      <Demo />
      <Audience />
      <Comparison />
      <Team />
      <Faq />
      <Waitlist />
    </>
  );
}
