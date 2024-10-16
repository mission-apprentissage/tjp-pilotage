"use client";

import {
  AspectRatio,
  Container,
  Flex,
  Img,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select, { CSSObjectWithLabel, StylesConfig } from "react-select";

import { client } from "../../../../api.client";
import { NsfOption, NsfOptions } from "./types";

const selectStyle: StylesConfig<NsfOption, false> = {
  control: (styles: CSSObjectWithLabel) => ({
    ...styles,
    width: "100%",
    zIndex: "2",
  }),
  input: (styles) => ({ ...styles, width: "100%" }),
  menu: (styles) => ({ ...styles, width: "100%" }),
  container: (styles) => ({ ...styles, width: "100%" }),
  groupHeading: (styles) => ({
    ...styles,
    fontWeight: "bold",
    color: "#161616",
    fontSize: "14px",
  }),
};

export const PanoramaFormationClient = ({
  defaultNsf,
}: {
  defaultNsf: NsfOptions;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [selectedNsf, setSelectedNsf] = useState<NsfOption | null>(null);

  const { data, isLoading, refetch } = client
    .ref("[GET]/domaine-de-formation")
    .useQuery(
      { query: { search } },
      { enabled: !!search, initialData: defaultNsf }
    );

  const onNsfSelected = (selected: NsfOption | null) => {
    if (selected) {
      setSelectedNsf(selected);
      if (selected.type === "formation") {
        router.push(`/formation/${selected.nsf}?cfd=${selected.value}`);
      } else {
        router.push(`/formation/${selected.value}`);
      }
    }
  };

  return (
    <Container
      px="48px"
      as="section"
      py="40px"
      bg="bluefrance.975"
      maxWidth={"container.xl"}
      h={"100%"}
    >
      <Flex align="center" direction="row" justify="space-between">
        <VisuallyHidden>
          <Text as={"h1"}>
            Rechercher un domaine de formation (NSF) ou par formation
          </Text>
        </VisuallyHidden>
        <Flex flexDirection="column" gap="2" w="50%">
          <label htmlFor="nsf-select" style={{ fontWeight: "bold" }}>
            Rechercher un domaine de formation (NSF) ou par formation
          </label>
          <Flex width="100%">
            <Select
              id="nsf-select"
              noOptionsMessage={({ inputValue }) =>
                inputValue
                  ? "Pas de formation correspondant à votre recherche"
                  : "Commencez à écrire..."
              }
              isLoading={isLoading}
              inputValue={search}
              value={selectedNsf}
              options={[
                {
                  label: `DOMAINES DE FORMATION (${
                    (data ?? []).filter((option) => option.type === "nsf")
                      .length
                  })`,
                  options: (data ?? []).filter(
                    (option) => option.type === "nsf"
                  ),
                },
                {
                  label: `FORMATIONS (${
                    (data ?? []).filter((option) => option.type === "formation")
                      .length
                  })`,
                  options: (data ?? []).filter(
                    (option) => option.type === "formation"
                  ),
                },
              ]}
              onChange={(selected) => onNsfSelected(selected as NsfOption)}
              onInputChange={(value) => setSearch(value)}
              isSearchable={true}
              onMenuOpen={() => refetch()}
              onMenuClose={() => setSearch("")}
              placeholder="Saisir un nom de domaine, un libellé de formation, un code diplôme..."
              styles={selectStyle}
              isMulti={false}
            />
          </Flex>
        </Flex>
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img
            src="/illustrations/team-at-work.svg"
            objectFit="contain"
            alt="Illustration équipe en collaboration"
          />
        </AspectRatio>
      </Flex>
    </Container>
  );
};
