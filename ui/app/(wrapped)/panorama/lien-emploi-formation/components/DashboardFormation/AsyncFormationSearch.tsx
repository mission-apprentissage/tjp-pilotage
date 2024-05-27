"use client";

import { Text } from "@chakra-ui/react";
import { useId, useRef } from "react";
import { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

import { FormationOption } from "./Dashboard";

interface AsyncFormationSearchProps {
  codeNsf?: string;
  formation?: FormationOption;
  onSelectFormation: (option?: FormationOption) => void;
}

type Option = FormationOption | string;

const AsyncFormationSearch = ({
  codeNsf,
  formation,
  onSelectFormation,
}: AsyncFormationSearchProps) => {
  const selectElementRef =
    useRef<SelectInstance<Option, false, GroupBase<Option>>>(null);

  const { data: defaultFormations } = client
    .ref("[GET]/nsf-diplome/search/:search")
    .useQuery({ params: { search: "" }, query: { codeNsf } });

  const isDisabled = codeNsf === undefined;

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
        value={formation ?? ""}
        onChange={(selected) => {
          if (typeof selected !== "string")
            onSelectFormation(selected ?? undefined);
        }}
        loadOptions={(inputValue: string) => {
          return client
            .ref("[GET]/nsf-diplome/search/:search")
            .query({ params: { search: inputValue }, query: { codeNsf } });
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

export { AsyncFormationSearch };
