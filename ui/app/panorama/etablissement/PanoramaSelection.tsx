"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AspectRatio,
  Container,
  Flex,
  Img,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";

import { UaiForm } from "./UaiForm";

export function PanoramaSelection({ wrongUai }: { wrongUai?: string }) {
  const router = useRouter();

  const handleSubmit = (uai: string) => {
    router.push(`/panorama/etablissement/${uai}`);
  };

  return (
    <Container
      px="8"
      as="section"
      pb="12"
      pt="6"
      bg="#F9F8F6"
      maxWidth={"container.xl"}
    >
      <Breadcrumb
        pages={[
          { title: "Accueil", to: "/" },
          { title: "Panorama", to: "/panorama", active: true },
        ]}
      />
      <Flex align="center" direction="column">
        <UaiForm onUaiChanged={handleSubmit} />
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img src="/graphs_statistics.png" objectFit="contain" />
        </AspectRatio>
        {wrongUai && (
          <Alert maxW="300px" status="error" mt="6">
            <AlertIcon />
            <AlertDescription>
              Le code UAI {wrongUai} est incorrecte.
            </AlertDescription>
          </Alert>
        )}
      </Flex>
    </Container>
  );
}
