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
import { ApiType } from "shared";

import { Breadcrumb } from "@/components/Breadcrumb";

import { api } from "../../../api.client";

export function PanoramaSelection({
  regionOptions,
}: {
  regionOptions: ApiType<typeof api.getRegions>;
}) {
  const router = useRouter();

  const onCodeRegionChanged = (codeRegion: string) => {
    router.push(`/panorama/region/${codeRegion}`);
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
          { title: "Panorama", to: "/panorama/region", active: true },
        ]}
      />
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
