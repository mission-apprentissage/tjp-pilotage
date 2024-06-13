"use client";

import { Flex, HStack, Tag, Text, Tooltip } from "@chakra-ui/react";
import { getYear, parse as parseDate } from "date-fns";
import { useId, useRef } from "react";
import {
  components,
  GroupBase,
  SelectInstance,
  SingleValueProps,
} from "react-select";
import AsyncSelect from "react-select/async";
import { CURRENT_RENTREE, VoieEnum } from "shared";

import { client } from "@/api.client";

import { FormationOption } from "../page";

interface AsyncFormationSearchProps {
  codeNsf?: string;
  formation?: FormationOption;
  onSelectFormation: (option?: FormationOption) => void;
}

type Option = FormationOption | string;

const isDateFermetureThisYear = (dateFermeture: string) => {
  const date = parseDate(dateFermeture, "dd/MM/yyyy", new Date());

  if (getYear(date) <= parseInt(CURRENT_RENTREE) + 1) {
    return true;
  }

  return false;
};

const OptionLabel = ({ option }: { option: FormationOption }) => {
  return (
    <Flex gap={2} justifyContent="space-between" width="100%">
      <Text overflow={"hidden"} textOverflow="ellipsis">
        {option?.label}
      </Text>
      <HStack>
        {option?.data?.dateFermeture &&
          isDateFermetureThisYear(option.data.dateFermeture) && (
            <Tooltip label={`Fermeture au ${option?.data?.dateFermeture}.`}>
              <Tag
                colorScheme={"red"}
                size={"md"}
                maxHeight={4}
                minW={"fit-content"}
                my={"auto"}
                textAlign={"center"}
              >
                Ferm.
              </Tag>
            </Tooltip>
          )}
        {option?.data?.voies.includes(VoieEnum.apprentissage) && (
          <Tooltip label="Cette formation est aussi dispensée en apprentissage.">
            <Tag
              colorScheme={"orange"}
              size={"md"}
              maxHeight={4}
              minW={"fit-content"}
              my={"auto"}
              textAlign={"center"}
            >
              Appr.
            </Tag>
          </Tooltip>
        )}
      </HStack>
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
          SingleValue: ({ ...props }) => (
            <SingleValue
              reactSelectProps={{ ...props } as SingleValueProps<Option>}
              formation={formation ?? ""}
            />
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
