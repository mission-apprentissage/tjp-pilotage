"use client";

import { Alert, AlertDescription, AlertIcon, AspectRatio, Container, Flex, Img } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { UaisFilterContext } from "@/app/layoutClient";

import { UaiForm } from "./UaiForm";

export function PanoramaSelection({ wrongUai }: { readonly wrongUai?: string }) {
  const router = useRouter();
  const { uaisFilter } = useContext(UaisFilterContext);

  useEffect(() => {
    if (uaisFilter) onUaiChanged(uaisFilter[0]);
  }, []);

  const onUaiChanged = (uai: string) => {
    router.push(`/panorama/etablissement/${uai}`);
  };

  return (
    <Container px="8" as="section" pb="12" pt="6" bg="grey.975" maxWidth={"container.xl"} h={"100%"}>
      <Flex align="center" direction="column">
        <UaiForm uai={uaisFilter?.[0]} onUaiChanged={onUaiChanged} inError={!!wrongUai} />
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img src="/graphs_statistics.png" objectFit="contain" alt="" />
        </AspectRatio>
        {wrongUai && (
          <Alert maxW="300px" status="error" mt="6">
            <AlertIcon />
            <AlertDescription>Le code UAI {wrongUai} est incorrecte.</AlertDescription>
          </Alert>
        )}
      </Flex>
    </Container>
  );
}
