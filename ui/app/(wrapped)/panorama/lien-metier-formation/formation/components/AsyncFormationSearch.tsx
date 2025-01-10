"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useId, useRef } from "react";
import type { GroupBase, SelectInstance, SingleValueProps } from "react-select";
import { components } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";
import type { FormationOption } from "@/app/(wrapped)/panorama/lien-metier-formation/formation/page";

interface AsyncFormationSearchProps {
  codeNsf?: string;
  formation?: FormationOption;
  onSelectFormation: (option?: FormationOption) => void;
}

type Option = FormationOption | string;

const OptionLabel = ({ option }: { option: FormationOption }) => {
  return (
    <Flex gap={2} justifyContent="space-between" width="100%">
      <Text overflow={"hidden"} textOverflow="ellipsis">
        {option?.label}
      </Text>
    </Flex>
  );
};

const SingleValue = ({
  reactSelectProps,
  formation,
}: {
  reactSelectProps: SingleValueProps<Option>;
  formation: Option;
}) => {
  if (typeof formation === "string") {
    return (
      <components.SingleValue {...reactSelectProps}>
        <Text></Text>
      </components.SingleValue>
    );
  }

  return (
    <components.SingleValue {...reactSelectProps}>
      <OptionLabel option={formation} />
    </components.SingleValue>
  );
};

const AsyncFormationSearch = ({ codeNsf, formation, onSelectFormation }: AsyncFormationSearchProps) => {
  const selectElementRef = useRef<SelectInstance<Option, false, GroupBase<Option>>>(null);

  const { data: defaultFormations } = client
    .ref("[GET]/nsf-diplome/search/:search")
    .useQuery({ params: { search: "" }, query: { codeNsf } });

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
  };

  return (
    <>
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
          SingleValue: ({ ...props }) => (
            <SingleValue reactSelectProps={{ ...props } as SingleValueProps<Option>} formation={formation ?? ""} />
          ),
        }}
        formatOptionLabel={(option: FormationOption | string) => {
          if (typeof option !== "string") {
            return <OptionLabel option={option} />;
          }

          return <Text>{option}</Text>;
        }}
        defaultOptions={defaultFormations ?? []}
        value={formation ?? ""}
        onChange={(selected) => {
          if (typeof selected !== "string") onSelectFormation(selected ?? undefined);
        }}
        loadOptions={(inputValue: string) => {
          return client
            .ref("[GET]/nsf-diplome/search/:search")
            .query({ params: { search: inputValue }, query: { codeNsf } });
        }}
        loadingMessage={({ inputValue }) =>
          inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
        }
        isClearable={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "Pas de formation correspondante" : "Commencez à écrire..."
        }
        placeholder="Libellé formation"
      />
    </>
  );
};

export { AsyncFormationSearch };
