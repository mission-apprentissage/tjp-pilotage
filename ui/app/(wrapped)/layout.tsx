import "react-notion-x/src/styles.css";

import { client } from "@/api.client";

import { EnvBandeau } from "./components/EnvBandeau";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MaintenancePage } from "./components/MaintenancePage";

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const { isMaintenance } = await client.ref("[GET]/maintenance").query({});

  return (
    <>
      <EnvBandeau />
      <Header isMaintenance={isMaintenance} />
      {isMaintenance ? <MaintenancePage /> : children}
      <Footer />
    </>
  );
}
