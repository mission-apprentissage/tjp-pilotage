"use client";

import { useSelectedLayoutSegments } from "next/navigation";

import { LandingFooter } from "./LandingFooter";
import { MinimalFooter } from "./MinimalFooter";

const LANDING_FOOTER_SEGMENTS = [
  "panorama",
  "pilotage",
  "pilotage-reforme",
  "ressources",
  "confidentialite",
  "mentions-legales",
  "statistiques",
  "documentation",
  "declaration-accessibilite",
];

export const Footer = () => {
  const segments = useSelectedLayoutSegments();
  const shouldUseLandingFooter =
    segments.length === 0 ||
    segments.some((segment) => LANDING_FOOTER_SEGMENTS.includes(segment));

  return shouldUseLandingFooter ? <LandingFooter /> : <MinimalFooter />;
};
