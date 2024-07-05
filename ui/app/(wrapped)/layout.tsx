import "react-notion-x/src/styles.css";

import { EnvBandeau } from "@/app/(wrapped)/components/EnvBandeau";
import { Footer } from "@/app/(wrapped)/components/Footer";
import { Header } from "@/app/(wrapped)/components/Header";

import { client } from "../../api.client";
import { MaintenancePage } from "./components/MaintenancePage";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { isMaintenance } = await client.ref("[GET]/maintenance").query({});
  console.log(isMaintenance);

  return (
    <>
      <EnvBandeau />
      <Header isMaintenance={isMaintenance} />
      {isMaintenance ? <MaintenancePage /> : children}
      <Footer />
    </>
  );
}
