import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function PanoramaEtablissementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Container maxWidth={"container.xl"} py="4">
      {children}
    </Container>
  );
}
