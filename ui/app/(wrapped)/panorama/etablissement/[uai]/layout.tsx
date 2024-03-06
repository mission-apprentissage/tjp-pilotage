import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function EtablissementLayout({
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
