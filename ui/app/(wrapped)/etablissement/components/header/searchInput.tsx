import { Search2Icon } from "@chakra-ui/icons";
import { Button, GridItem, Input } from "@chakra-ui/react";
import { useState } from "react";

export const SearchInput = ({
  search,
}: {
  search: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");

  const onSearchValue = () => {
    search(searchValue);
  };

  return (
    <GridItem colSpan={5} justifySelf={"end"}>
      <Input
        type="text"
        placeholder="Rechercher un établissement par UAI, nom, commune..."
        w="md"
        mr={2}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearchValue();
        }}
      />
      <Button
        bgColor={"bluefrance.113"}
        size={"md"}
        onClick={() => onSearchValue()}
      >
        <Search2Icon color="white" />
      </Button>
    </GridItem>
  );
};
