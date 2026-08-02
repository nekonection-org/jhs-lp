"use client";

import { useEffect, useState } from "react";

import type { NavigableSectionId } from "@/content/types";

function isNavigableSectionId(
  value: string,
  sectionIds: readonly NavigableSectionId[],
): value is NavigableSectionId {
  return sectionIds.some((sectionId) => sectionId === value);
}

export function useActiveSection(sectionIds: readonly NavigableSectionId[]) {
  const [activeSection, setActiveSection] = useState<NavigableSectionId | null>(
    null,
  );

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0 || !("IntersectionObserver" in window)) {
      return;
    }

    const visibleSections = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }

        const [mostVisible] = [...visibleSections.entries()].sort(
          (a, b) => b[1] - a[1],
        );

        if (mostVisible && isNavigableSectionId(mostVisible[0], sectionIds)) {
          setActiveSection(mostVisible[0]);
        }
      },
      {
        rootMargin: "-18% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.45, 0.7],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
