"use client";

import { useSelectedLayoutSegments } from "next/navigation";

import { LandingFooter } from "./LandingFooter";
import { MinimalFooter } from "./MinimalFooter";

const LANDING_FOOTER_SEGMENTS = [
  "panorama",
  "pilotage",
  "suivi-impact",
  "ressources",
  "changelog",
  "declaration-accessibilite",
  "politique-de-confidentialite",
  "cgu",
  "mentions-legales",
  "statistiques"
];

export const Footer = () => {
  const segments = useSelectedLayoutSegments();
  const shouldUseLandingFooter =
    segments.length === 0 || segments.some((segment) => LANDING_FOOTER_SEGMENTS.includes(segment));

  return shouldUseLandingFooter ? <LandingFooter /> : <MinimalFooter />;
};
