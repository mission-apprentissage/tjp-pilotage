import "./globals.css";

import type { AxiosError } from "axios";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { serverClient } from "@/api.client";

import RootLayoutClient from "./layoutClient";

export const metadata: Metadata = {
  title: "Orion",
  robots: "none",
  description: "Pilotage de la carte des formations",
};

const fetchAuth = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await serverClient.ref("[GET]/auth/whoAmI").query({}, { headers: headersList });
  } catch (e) {
    console.log("nooo", (e as AxiosError).code);
    return undefined;
  }
};

const fetchChangelog = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await serverClient.ref("[GET]/changelog").query({}, { headers: headersList });
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const fetchGlossaire = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await serverClient.ref("[GET]/glossaire").query({}, { headers: headersList });
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const auth = await fetchAuth();
  const changelog = await fetchChangelog();
  const glossaire = await fetchGlossaire();
  return (
    <RootLayoutClient auth={auth || undefined} changelog={changelog || []} glossaire={glossaire || []}>
      {children}
    </RootLayoutClient>
  );
}

export default Layout;
