"use client";

import { Flex, Text } from "@chakra-ui/react";
import _ from "lodash";
import { useId, useRef } from "react";
import type { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";
import type { FormationOption } from "@/app/(wrapped)/panorama/lien-metier-formation/formation/page";

interface AsyncFormationSearchProps {
  codeNsf?: string;
  formation?: FormationOption;
  onSelectFormation: (option?: FormationOption) => void;
}

type Option = FormationOption | string;
type Options = (typeof client.infer)["[GET]/nsf-diplome/search/:search"];

const AsyncFormationSearch = ({ codeNsf, formation, onSelectFormation }: AsyncFormationSearchProps) => {
  const selectElementRef = useRef<SelectInstance<Option, false, GroupBase<Option>>>(null);

  const { data: defaultFormations } = client
    .ref("[GET]/nsf-diplome/search/:search")
    .useQuery({ params: { search: "" }, query: { codeNsf } });

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
  };

  const searchNsfDiplome = _.debounce((inputValue: string, callback: (options: Options) => void) => {
    client
      .ref("[GET]/nsf-diplome/search/:search")
      .query({ params: { search: inputValue }, query: { codeNsf } })
      .then(options => callback(options));
  }, 300);

  return (
    <Flex direction="column" gap={1}>
      <Text as="label" onClick={openSelect} pb="4px" cursor="pointer" htmlFor="select-diplome">
        Formation
      </Text>
      <AsyncSelect
        inputId="select-diplome"
        ref={selectElementRef}
        instanceId={useId()}
        name={"select-diplome"}
        components={{
          IndicatorSeparator: () => null,
        }}
        defaultOptions={defaultFormations ?? []}
        value={formation ?? ""}
        onChange={(selected) => {
          if (typeof selected !== "string") onSelectFormation(selected ?? undefined);
        }}
        loadOptions={searchNsfDiplome}
        loadingMessage={({ inputValue }) =>
          inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
        }
        isClearable={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "Pas de formation correspondante" : "Commencez à écrire..."
        }
        placeholder="Libellé formation"
      />
    </Flex>
  );
};

export { AsyncFormationSearch };
