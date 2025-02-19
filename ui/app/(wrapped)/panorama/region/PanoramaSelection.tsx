"use client";

import { AspectRatio, Container, Flex, FormControl, FormLabel, Img, Select } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import * as qs from "qs";
import { useContext, useEffect } from "react";

import type { client } from "@/api.client";
import { DEFAULT_SEARCH_PARAMS } from "@/app/(wrapped)/panorama/types";
import { CodeRegionFilterContext } from "@/app/layoutClient";

export function PanoramaSelection({
  regionOptions,
}: {
  readonly regionOptions: (typeof client.infer)["[GET]/regions"];
}) {
  const router = useRouter();
  const { codeRegionFilter, setCodeRegionFilter } = useContext(CodeRegionFilterContext);

  useEffect(() => {
    if (codeRegionFilter) onCodeRegionChanged(codeRegionFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCodeRegionChanged = (codeRegion: string) => {
    setCodeRegionFilter(codeRegion);
    router.push(`/panorama/region/${codeRegion}?${qs.stringify(DEFAULT_SEARCH_PARAMS)}`);
  };

  return (
    <Container px="8" as="section" pb="12" pt="6" bg="grey.975" maxWidth={"container.xl"} h={"100%"}>
      <Flex align="center" direction="column">
        <FormControl margin="auto" maxW="300px">
          <FormLabel>Choisissez une région pour commencer</FormLabel>
          <Select onChange={(e) => onCodeRegionChanged(e.target.value)} variant="input">
            <option key="-" value="">
              -
            </option>
            {regionOptions?.map((option) => (
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
