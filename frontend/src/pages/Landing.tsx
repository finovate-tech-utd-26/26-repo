import { Hero } from "@/components/landing/Hero";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { StepDiagram } from "@/components/landing/StepDiagram";
import { ValueStrip } from "@/components/landing/ValueStrip";
import { DemoTeaser } from "@/components/landing/DemoTeaser";
import { TrustNote } from "@/components/landing/TrustNote";
import { Footer } from "@/components/Footer";

export default function Landing() {
  return (
    <div>
      <Hero />
      <ProblemStatement />
      <StepDiagram />
      <ValueStrip />
      <DemoTeaser />
      <TrustNote />
      <Footer />
    </div>
  );
}
