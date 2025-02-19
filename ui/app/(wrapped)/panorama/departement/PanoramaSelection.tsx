"use client";

import { AspectRatio, Container, Flex, FormControl, FormLabel, Img, Select } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
/* eslint-disable-next-line import/default */
import qs from "qs";
import { useContext, useEffect } from "react";

import type { client } from "@/api.client";
import { DEFAULT_SEARCH_PARAMS } from "@/app/(wrapped)/panorama/types";
import { CodeDepartementContext } from "@/app/codeDepartementContext";

export function PanoramaSelection({
  departementsOptions,
}: {
  readonly departementsOptions: (typeof client.infer)["[GET]/departements"];
}) {
  const router = useRouter();
  const { codeDepartement, setCodeDepartement } = useContext(CodeDepartementContext);

  useEffect(() => {
    if (codeDepartement) onCodeDepartementChanged(codeDepartement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCodeDepartementChanged = (codeDepartement: string) => {
    setCodeDepartement(codeDepartement);
    router.push(`/panorama/departement/${codeDepartement}?${qs.stringify(DEFAULT_SEARCH_PARAMS)}`);
  };

  return (
    <Container px="8" as="section" pb="12" pt="6" bg="grey.975" maxWidth={"container.xl"} h={"100%"}>
      <Flex align="center" direction="column">
        <FormControl margin="auto" maxW="300px">
          <FormLabel>Choisissez un département pour commencer</FormLabel>
          <Select onChange={(e) => onCodeDepartementChanged(e.target.value)} variant="input">
            <option key="-" value="">
              -
            </option>
            {departementsOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img src="/graphs_statistics.png" objectFit="contain" alt=""/>
        </AspectRatio>
      </Flex>
    </Container>
  );
}
