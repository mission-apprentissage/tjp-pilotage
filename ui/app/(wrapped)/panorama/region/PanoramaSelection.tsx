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

import { client } from "../../../../api.client";
import { CodeRegionFilterContext } from "../../../layoutClient";

export function PanoramaSelection({
  regionOptions,
}: {
  regionOptions: (typeof client.infer)["[GET]/regions"];
}) {
  const router = useRouter();
  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  useEffect(() => {
    if (codeRegionFilter != "") {
      router.push(`/panorama/region/${codeRegionFilter}`);
    }
  }, []);

  const onCodeRegionChanged = (codeRegion: string) => {
    setCodeRegionFilter(codeRegion);
    router.push(`/panorama/region/${codeRegion}`);
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
          <FormLabel>Choisissez une région pour commencer</FormLabel>
          <Select
            onChange={(e) => onCodeRegionChanged(e.target.value)}
            variant="input"
          >
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
          <Img src="/graphs_statistics.png" objectFit="contain" />
        </AspectRatio>
      </Flex>
    </Container>
  );
}
