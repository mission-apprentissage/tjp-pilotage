import "react-notion-x/src/styles.css";

import { Header } from "../_components/Header";

export default function RootLayoutClient({
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
