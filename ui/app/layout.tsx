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

const fetchChangelog = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/changelog")
      .query({}, { headers: headersList });
  } catch (e) {
    return undefined;
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const auth = await fetchAuth();
  const changelog = await fetchChangelog();
  return (
    <RootLayoutClient auth={auth || undefined} changelog={changelog || []}>
      {children}
    </RootLayoutClient>
  );
}

export default Layout;
