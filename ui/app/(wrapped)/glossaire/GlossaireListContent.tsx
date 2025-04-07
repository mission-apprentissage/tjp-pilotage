import { Box, Input, InputGroup, InputLeftElement, StackDivider, Text, useToken, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import { useEffect, useRef, useState } from "react";

import { GlossaireListContentItem } from "./GlossaireListContentItem";
import type { GlossaireEntries } from "./types";

const useGlossaireList = (initialEntries: GlossaireEntries) => {
  const trackEvent = usePlausible();
  const [searchValue, setSearchValue] = useState("");
  const [entries, setEntries] = useState<GlossaireEntries>(initialEntries);
  const [greyColor] = useToken("colors", ["grey.625"]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntries(() =>
      initialEntries.filter(
        (entry) => searchValue === "" || entry?.title?.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
      )
    );
  }, [searchValue, setEntries, initialEntries]);

  useEffect(() => {
    trackEvent("glossaire", { props: { name: "Liste" } });
  }, [trackEvent]);

  useEffect(() => {
    // Focus initial sur l'input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return {
    entries,
    searchValue,
    setSearchValue,
    greyColor,
    inputRef,
  };
};

export const GlossaireListContent = ({
  selectEntry,
  initialEntries,
}: {
  selectEntry: (e: string) => void;
  initialEntries: GlossaireEntries;
}) => {
  const { entries, searchValue, setSearchValue, greyColor, inputRef } = useGlossaireList(initialEntries);

  return (
    <>
      <Box display="flex" flexDirection={"row"} alignItems={"center"} style={{ marginBottom: "18px" }}>
        <Icon icon="ri:arrow-right-line" height={32} style={{ marginRight: "8px" }} />
        <Text fontSize="x-large" fontWeight={"900"}>
          Glossaire
        </Text>
      </Box>
      <InputGroup size={"lg"} mb="24px">
        <InputLeftElement pointerEvents="none">
          <Icon icon="ri:search-line" height={24} style={{ color: greyColor }} />
        </InputLeftElement>
        <Input
          ref={inputRef}
          placeholder="Rechercher une définition"
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          value={searchValue}
        />
      </InputGroup>
      <VStack divider={<StackDivider borderColor="grey.950" />} spacing={0} cursor={"pointer"}>
        {(entries ?? []).map((entry) => (
          <GlossaireListContentItem
            key={entry.slug}
            entry={entry}
            selectEntry={selectEntry}
            searchValue={searchValue}
          />
        ))}
      </VStack>
    </>
  );
};
