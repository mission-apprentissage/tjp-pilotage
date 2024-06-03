"use client";

import { Text } from "@chakra-ui/react";
import { useId, useRef } from "react";
import { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

import { NsfOption } from "../page";

interface AsyncNsfSearchProps {
  nsf?: NsfOption;
  onSelectNsf: (option?: NsfOption) => void;
}

const AsyncNsfSearch = ({ onSelectNsf, nsf }: AsyncNsfSearchProps) => {
  const selectElementRef =
    useRef<SelectInstance<NsfOption, false, GroupBase<NsfOption>>>(null);

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
  };

  const { data: defaultNsfValues } = client
    .ref("[GET]/nsf/search/:search")
    .useQuery({ params: { search: "" } });

  return (
    <>
      <Text onClick={openSelect} pb="4px" cursor="pointer">
        Domaine de formation
      </Text>
      <AsyncSelect
        ref={selectElementRef}
        instanceId={useId()}
        name={"select-nsf"}
        components={{
          IndicatorSeparator: () => null,
        }}
        value={nsf}
        onChange={(selected) => {
          onSelectNsf(selected ?? undefined);
        }}
        defaultOptions={defaultNsfValues ?? []}
        loadOptions={(inputValue: string) => {
          if (inputValue.length >= 3)
            return client
              .ref("[GET]/nsf/search/:search")
              .query({ params: { search: inputValue } });
        }}
        loadingMessage={({ inputValue }) =>
          inputValue.length >= 3
            ? "Recherche..."
            : "Veuillez rentrer au moins 3 lettres"
        }
        isClearable={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue
            ? "Pas de domaine de formation correspondant"
            : "Commencez à écrire..."
        }
        placeholder="Libellé domaine de formation"
      />
    </>
  );
};

export { AsyncNsfSearch };
