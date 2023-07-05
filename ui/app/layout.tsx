import "./globals.css";

import { Metadata } from "next";

import RootLayoutClient from "./layoutClient";

export const metadata: Metadata = {
  title: "Orion",
  robots: "none",
  description: "Pilotage de la carte des formations",
};

export default ({ children }: { children: React.ReactNode }) => {
  return <RootLayoutClient>{children}</RootLayoutClient>;
};
