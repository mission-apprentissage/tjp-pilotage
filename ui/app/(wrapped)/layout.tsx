import "react-notion-x/src/styles.css";

import { Header } from "@/app/(wrapped)/components/Header";

import { Footer } from "./components/Footer";

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
