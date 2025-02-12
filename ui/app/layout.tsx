import "./globals.css";

import type { AxiosError } from "axios";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { serverClient } from "@/api.client";
import { getMetadata } from "@/utils/handleMetadata";

import RootLayoutClient from "./layoutClient";

type Props = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  _: Props,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any
): Promise<Metadata> {
  const { title, description } = getMetadata(state);

  return {
    title,
    description,
    robots: "none",
  };
}

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

const fetchCampagne = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await serverClient.ref("[GET]/campagne/current").query({}, { headers: headersList });
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
  const campagnes = await fetchCampagne();
  return (
    <RootLayoutClient
      auth={auth || undefined}
      changelog={changelog || []}
      glossaire={glossaire || []}
      currentCampagne={campagnes?.current}
      previousCampagne={campagnes?.previous}
    >
      {children}
    </RootLayoutClient>
  );
}

export default Layout;
