"use client";

import { Flex, Tag, Text, VStack } from "@chakra-ui/react";
import { useId, useRef } from "react";
import { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";
import { VoieEnum } from "shared";

import { client } from "@/api.client";

import { FormationOption } from "../page";

interface AsyncFormationSearchProps {
  codeNsf?: string;
  formation?: FormationOption;
  onSelectFormation: (option?: FormationOption) => void;
}

type Option = FormationOption | string;

const OptionLabel = ({ option }: { option: FormationOption }) => {
  return (
    <Flex gap={2}>
      <Text
        textOverflow={"ellipsis"}
        overflow={"hidden"}
        maxW={"75%"}
        w="fit-content"
      >
        {option.label}
      </Text>
      <VStack>
        {option?.data?.dateFermeture && (
          <Tag
            colorScheme={"red"}
            size={"md"}
            maxHeight={4}
            minW={"fit-content"}
            my={"auto"}
            textAlign={"center"}
          >
            Fermeture au {option.data.dateFermeture}
          </Tag>
        )}
        {option?.data?.voies.includes(VoieEnum.apprentissage) && (
          <Tag
            colorScheme={"orange"}
            size={"md"}
            maxHeight={4}
            minW={"fit-content"}
            my={"auto"}
            textAlign={"center"}
          >
            Apprentissage
          </Tag>
        )}
      </VStack>
    </Flex>
  );
};

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

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
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
        formatOptionLabel={(option: FormationOption | string) => {
          if (typeof option !== "string") {
            return <OptionLabel option={option} />;
          }

          return <Text>{option}</Text>;
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
      />
    </>
  );
};

export { AsyncFormationSearch };
