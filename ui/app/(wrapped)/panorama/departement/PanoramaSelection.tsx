"use client";

import {
  AspectRatio,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { CodeDepartementFilterContext } from "../../../layoutClient";

export function PanoramaSelection({
  departementsOptions,
}: {
  departementsOptions: ApiType<typeof api.getDepartements>;
}) {
  const router = useRouter();
  const { codeDepartementFilter, setCodeDepartementFilter } = useContext(
    CodeDepartementFilterContext
  );

  useEffect(() => {
    if (codeDepartementFilter != "") {
      router.push(`/panorama/departement/${codeDepartementFilter}`);
    }
  }, []);

  const onCodeDepartementChanged = (codeDepartement: string) => {
    setCodeDepartementFilter(codeDepartement);
    router.push(`/panorama/departement/${codeDepartement}`);
  };

  return (
    <Container
      px="8"
      as="section"
      pb="12"
      pt="6"
      bg="grey.975"
      maxWidth={"container.xl"}
    >
      <Flex align="center" direction="column">
        <FormControl margin="auto" maxW="300px">
          <FormLabel>Choisissez un département pour commencer</FormLabel>
          <Select
            onChange={(e) => onCodeDepartementChanged(e.target.value)}
            variant="input"
          >
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
          <Img src="/graphs_statistics.png" objectFit="contain" />
        </AspectRatio>
      </Flex>
    </Container>
  );
}
