import { EnvBandeau } from "@/app/(wrapped)/components/EnvBandeau";
import { Footer } from "@/app/(wrapped)/components/Footer";
import { Header } from "@/app/(wrapped)/components/Header";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      <EnvBandeau />
      <Header isMaintenance={true} />
      {children}
      <Footer />
    </>
  );
}
