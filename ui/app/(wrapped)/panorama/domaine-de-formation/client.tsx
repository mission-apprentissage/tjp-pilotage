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

import { SelectNsf } from "./components/selectNsf";
import type { NsfOptions } from "./types";

export const PanoramaDomaineDeFormationClient = ({
  defaultNsf,
  wrongNsf,
}: {
  defaultNsf: NsfOptions;
  wrongNsf?: string;
}) => {
  const router = useRouter();
  return (
    <Container px="48px" as="section" py="40px" bg="bluefrance.975" maxWidth={"container.xl"} h={"100%"}>
      <Flex align="center" direction="row" justify="space-between">
        <Flex w={"50%"} direction={"column"} gap={"4"}>
          <SelectNsf
            defaultNsfs={defaultNsf}
            defaultSelected={null}
            w={"100%"}
            isClearable={false}
            routeSelectedNsf={(selected) => {
              if (selected.type === "formation") {
                router.push(`/domaine-de-formation/${selected.nsf}?cfd=${selected.value}`);
              } else {
                router.push(`/domaine-de-formation/${selected.value}`);
              }
            }}
          />
          {wrongNsf && (
            <Alert w={"100%"} status="error">
              <AlertIcon />
              <AlertDescription>
                Aucun domaine de formation trouvé pour le NSF <strong>{wrongNsf}</strong>.
              </AlertDescription>
            </Alert>
          )}
        </Flex>
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img src="/illustrations/team-at-work.svg" objectFit="contain" alt="Illustration équipe en collaboration" />
        </AspectRatio>
      </Flex>
    </Container>
  );
};
