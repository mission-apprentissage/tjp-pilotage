"use client";

import { useEffect, useState } from "react";

import { client } from "@/api.client";

import { EnvBandeau } from "./components/EnvBandeau";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MaintenancePage } from "./components/MaintenancePage";

export default function RootTemplate({ children }: { readonly children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const response = await client.ref("[GET]/maintenance").query({});
      setIsMaintenance(response.isMaintenance);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <>
      <EnvBandeau />
      <Header isMaintenance={isMaintenance} />
      {isMaintenance ? <MaintenancePage /> : children}
      <Footer />
    </>
  );
}
