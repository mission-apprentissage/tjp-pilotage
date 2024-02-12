import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SkeletonText,
  StackDivider,
  Text,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { client } from "../../../api.client";
import { GlossaireListContentItem } from "./GlossaireListContentItem";
import { GlossaireEntry } from "./types";

const GlossaireListContentSkeleton = () => {
  return (
    <Flex direction={"column"}>
      <SkeletonText noOfLines={5} spacing="4" skeletonHeight="20" />
    </Flex>
  );
};

const useGetGlossaireList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [entries, setEntries] = useState<GlossaireEntry>([]);
  const [greyColor] = useToken("colors", ["grey.625"]);
  const { data, isLoading, isError, error } = client
    .ref("[GET]/glossaire")
    .useQuery(
      {},
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  useEffect(() => {
    setEntries(
      (data ?? []).filter(
        (entry) =>
          searchValue === "" ||
          entry?.title?.toLowerCase().includes(searchValue.toLowerCase().trim())
      )
    );
  }, [searchValue, data]);

  useEffect(() => {
    setEntries(data ?? []);
  }, [data]);

  return {
    entries,
    isLoading,
    isError,
    error,
    searchValue,
    setSearchValue,
    greyColor,
  };
};

export const GlossaireListContent = ({
  selectEntry,
}: {
  selectEntry: (e: string) => void;
}) => {
  const {
    entries,
    isLoading,
    isError,
    searchValue,
    setSearchValue,
    greyColor,
  } = useGetGlossaireList();

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
        <InputLeftElement pointerEvents="none">
          <Icon
            icon="ri:search-line"
            height={24}
            style={{ color: greyColor }}
          />
        </InputLeftElement>
        <Input
          placeholder="Rechercher une définition"
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          value={searchValue}
        />
      </InputGroup>
      {isLoading && <GlossaireListContentSkeleton />}
      {isError && <Text>Erreur lors du chargement</Text>}
      {!isLoading && !isError && (
        <VStack
          divider={<StackDivider borderColor="grey.950" />}
          spacing={0}
          cursor={"pointer"}
        >
          {(entries ?? []).map((entry) => (
            <GlossaireListContentItem
              key={entry.id}
              entry={entry}
              selectEntry={selectEntry}
              searchValue={searchValue}
            />
          ))}
        </VStack>
      )}
    </>
  );
};
