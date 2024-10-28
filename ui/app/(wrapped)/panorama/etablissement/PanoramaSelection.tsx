"use client";

import { Alert, AlertDescription, AlertIcon, AspectRatio, Container, Flex, Img } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { UaiFilterContext } from "@/app/layoutClient";

import { UaiForm } from "./UaiForm";

export function PanoramaSelection({ wrongUai }: { readonly wrongUai?: string }) {
  const router = useRouter();
  const { uaiFilter, setUaiFilter } = useContext(UaiFilterContext);

  useEffect(() => {
    if (uaiFilter !== "") {
      router.push(`/panorama/etablissement/${uaiFilter}`);
    }
  }, []);

  const handleSubmit = (uai: string) => {
    setUaiFilter(uai);
    router.push(`/panorama/etablissement/${uai}`);
  };

  return (
    <Container px="8" as="section" pb="12" pt="6" bg="grey.975" maxWidth={"container.xl"} h={"100%"}>
      <Flex align="center" direction="column">
        <UaiForm uai={uaiFilter} onUaiChanged={handleSubmit} inError={!!wrongUai} />
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img src="/graphs_statistics.png" objectFit="contain" />
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
