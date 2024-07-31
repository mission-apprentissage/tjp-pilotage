"use client";

import "react-notion-x/src/styles.css";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useContext } from "react";

import { EnvBandeau } from "@/app/(wrapped)/components/EnvBandeau";
import { Footer } from "@/app/(wrapped)/components/Footer";
import { Header } from "@/app/(wrapped)/components/Header";

import { client } from "../../api.client";
import { AuthContext } from "./auth/authContext";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { auth, setAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    await client.ref("[POST]/auth/logout").query({});
    setAuth(undefined);
    queryClient.clear();
  }, [client, setAuth, queryClient]);

  return (
    <>
      <EnvBandeau />
      <Header logout={logout} auth={auth} />
      {children}
      <Footer />
    </>
  );
}
