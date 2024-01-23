import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { GLOSSAIRE_ENTRIES } from "./GlossaireEntries";
import { GlossaireListContentItem } from "./GlossaireListContentItem";
import { GlossaireEntryWithKey } from "./types";

const useGetGlossaireList = (searchValue: string) => {
  const [glossaireList, setGlossaireList] =
    useState<GlossaireEntryWithKey[]>(GLOSSAIRE_ENTRIES);

  useEffect(() => {
    setGlossaireList(
      GLOSSAIRE_ENTRIES.filter(
        (entry) =>
          searchValue === "" ||
          entry?.title?.toLowerCase().includes(searchValue.toLowerCase().trim())
      )
    );
  }, [searchValue]);

  return { glossaireList };
};

export const GlossaireListContent = ({
  selectEntry,
}: {
  selectEntry: (e: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { glossaireList } = useGetGlossaireList(searchValue);
  return (
    <>
      <Box
        display="flex"
        flexDirection={"row"}
        alignItems={"center"}
        style={{ marginBottom: "18px" }}
      >
        <Icon
          icon="ri:arrow-right-line"
          height={32}
          style={{ marginRight: "8px" }}
        />
        <Text fontSize="x-large" fontWeight={"900"}>
          Glossaire
        </Text>
      </Box>
      <InputGroup size={"lg"} mb="24px">
        <Input
          placeholder="Rechercher une définition"
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          value={searchValue}
        />
        <InputRightAddon
          backgroundColor={"bluefrance.113"}
          _hover={{ backgroundColor: "bluefrance.113_hover" }}
        >
          <IconButton
            aria-label="Rechercher dans le glossaire"
            variant={"unstyle"}
            color={"white"}
            icon={<Icon icon="ri:search-line" height={24} />}
          />
        </InputRightAddon>
      </InputGroup>
      <VStack
        divider={<StackDivider borderColor="grey.950" />}
        spacing={0}
        cursor={"pointer"}
      >
        {glossaireList.map((entry) => (
          <GlossaireListContentItem
            key={entry.id}
            entry={entry}
            selectEntry={selectEntry}
            searchValue={searchValue}
          />
        ))}
      </VStack>
    </>
  );
};
