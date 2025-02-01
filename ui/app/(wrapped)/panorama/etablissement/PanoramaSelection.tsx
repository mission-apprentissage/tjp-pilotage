"use client";

import { Alert, AlertDescription, AlertIcon, AspectRatio, Container, Flex, Img } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { UaisContext } from "@/app/context/uaiContext";

import { UaiForm } from "./UaiForm";

export function PanoramaSelection({ wrongUai }: { readonly wrongUai?: string }) {
  const router = useRouter();
  const { uais } = useContext(UaisContext);

  useEffect(() => {
    if (uais) onUaiChanged(uais[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUaiChanged = (uai: string) => {
    router.push(`/panorama/etablissement/${uai}`);
  };

  return (
    <Container px="8" as="section" pb="12" pt="6" bg="grey.975" maxWidth={"container.xl"} h={"100%"}>
      <Flex align="center" direction="column">
        <UaiForm uai={uais?.[0]} onUaiChanged={onUaiChanged} inError={!!wrongUai} />
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
