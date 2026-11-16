import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { HeroRhythm } from "@/components/ui/HeroRhythm";

export function HeroScrollScene({ children }: { children: ReactNode }) {
  return (
    <div className="hero-stage">
      <Container>
        <div className="hero-scroll-scene">{children}</div>
      </Container>
      <HeroRhythm />
    </div>
  );
}
