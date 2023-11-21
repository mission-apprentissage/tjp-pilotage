import "./globals.css";

import { Metadata } from "next";
import { headers } from "next/headers";

import { client } from "../api.client";
import RootLayoutClient from "./layoutClient";

export const metadata: Metadata = {
  title: "Orion",
  robots: "none",
  description: "Pilotage de la carte des formations",
};

const fetchAuth = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/auth/whoAmI")
      .query({}, { headers: headersList });
  } catch (e) {
    return undefined;
  }
};

export default async ({ children }: { children: React.ReactNode }) => {
  const auth = await fetchAuth();
  return (
    <RootLayoutClient auth={auth || undefined}>{children}</RootLayoutClient>
  );
};
