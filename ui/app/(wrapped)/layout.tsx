import "react-notion-x/src/styles.css";

import { Header } from "@/app/(wrapped)/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
