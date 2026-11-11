import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Design } from "@/components/sections/Design";
import { Gallery } from "@/components/sections/Gallery";
import { Audience } from "@/components/sections/Audience";
import { Comparison } from "@/components/sections/Comparison";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { Waitlist } from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Design />
      <Gallery />
      <Audience />
      <Comparison />
      <Team />
      <Faq />
      <Waitlist />
    </>
  );
}
