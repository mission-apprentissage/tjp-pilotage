"use client";

import { Text } from "@chakra-ui/react";
import { useId, useRef } from "react";
import { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

import { MetierOption } from "./Dashboard";

interface AsyncMetierSearchProps {
  codeDomaineProfessionnel?: string;
  metier?: MetierOption;
  onSelectMetier: (option?: MetierOption) => void;
}

type Option = MetierOption | string;

const AsyncMetierSearch = ({
  codeDomaineProfessionnel,
  metier,
  onSelectMetier,
}: AsyncMetierSearchProps) => {
  const selectElementRef =
    useRef<SelectInstance<Option, false, GroupBase<Option>>>(null);

  const { data: defaultFormations } = client
    .ref("[GET]/metier/search/:search")
    .useQuery({ params: { search: "" }, query: { codeDomaineProfessionnel } });

  const isDisabled = codeDomaineProfessionnel === undefined;

  const openSelect = () => {
    if (selectElementRef.current && !isDisabled)
      selectElementRef.current.openMenu("first");
  };

  return (
    <>
      <Text onClick={openSelect} pb="4px" cursor="pointer">
        Formation
      </Text>
      <AsyncSelect
        ref={selectElementRef}
        instanceId={useId()}
        name={"select-diplome"}
        components={{
          IndicatorSeparator: () => null,
        }}
        defaultOptions={defaultFormations ?? []}
        value={metier ?? ""}
        onChange={(selected) => {
          if (typeof selected !== "string")
            onSelectMetier(selected ?? undefined);
        }}
        loadOptions={(inputValue: string) => {
          return client.ref("[GET]/metier/search/:search").query({
            params: { search: inputValue },
            query: { codeDomaineProfessionnel },
          });
        }}
        loadingMessage={({ inputValue }) =>
          inputValue.length >= 3
            ? "Recherche..."
            : "Veuillez rentrer au moins 3 lettres"
        }
        isClearable={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue
            ? "Pas de formation correspondante"
            : "Commencez à écrire..."
        }
        placeholder="Libellé formation"
        isDisabled={isDisabled}
      />
    </>
  );
};

export default AsyncMetierSearch;
