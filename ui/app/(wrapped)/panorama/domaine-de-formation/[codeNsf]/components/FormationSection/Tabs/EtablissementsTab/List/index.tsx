import { List as ChakraList, ListItem, Skeleton } from "@chakra-ui/react";
import { useMemo } from "react";

import type { Etablissement } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";

import { CustomListItem } from "./CustomListItem";

export const List = ({ isLoading, etablissements }: { isLoading: boolean; etablissements: Etablissement[] }) => {
  const etablissementsListItems = useMemo(() => {
    return (etablissements ?? []).map((etablissement, i) => (
      <CustomListItem
        key={etablissement.uai}
        etablissement={etablissement}
        withDivider={i !== etablissements.length - 1}
      />
    ));
  }, [etablissements]);

  return (
    <ChakraList
      flexGrow={1}
      overflow="auto"
      width="100%"
      height="700px"
      _notLast={{ borderBottom: "1px solid", borderColor: "grey.200" }}
    >
      {isLoading ? (
        <ListItem key="loading">
          <Skeleton height="100px" width="100%" />
        </ListItem>
      ) : (
        etablissementsListItems
      )}
    </ChakraList>
  );
};
