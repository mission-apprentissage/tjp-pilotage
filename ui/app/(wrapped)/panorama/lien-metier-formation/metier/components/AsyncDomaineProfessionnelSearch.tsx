"use client";

import { Text } from "@chakra-ui/react";
import { useId, useRef } from "react";
import { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

import { TooltipIcon } from "../../../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../../../glossaire/glossaireContext";
import { DomaineProfessionnelOption } from "../page";

interface AsyncNsfSearchProps {
  domaineProfessionnel?: DomaineProfessionnelOption;
  onSelectDomaineProfessionnel: (option?: DomaineProfessionnelOption) => void;
}

const AsyncDomaineProfessionnelSearch = ({
  onSelectDomaineProfessionnel,
  domaineProfessionnel,
}: AsyncNsfSearchProps) => {
  const { openGlossaire } = useGlossaireContext();

  const selectElementRef =
    useRef<
      SelectInstance<
        DomaineProfessionnelOption,
        false,
        GroupBase<DomaineProfessionnelOption>
      >
    >(null);

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
  };
  const { data: defaultDomaineProfessionnelValue } = client
    .ref("[GET]/domaine-professionnel/search/:search")
    .useQuery({ params: { search: "" } });

  return (
    <>
      <Text onClick={openSelect} pb="4px" cursor="pointer">
        Domaine professionnel
        <TooltipIcon
          ml="1"
          label=""
          onClick={() => openGlossaire("domaine-professionnel-emploi")}
        />
      </Text>
      <AsyncSelect
        ref={selectElementRef}
        instanceId={useId()}
        name={"select-domaine-professionnel"}
        components={{
          IndicatorSeparator: () => null,
        }}
        value={domaineProfessionnel}
        onChange={(selected) => {
          onSelectDomaineProfessionnel(selected ?? undefined);
        }}
        defaultOptions={defaultDomaineProfessionnelValue ?? []}
        loadOptions={(inputValue: string) => {
          if (inputValue.length >= 3)
            return client
              .ref("[GET]/domaine-professionnel/search/:search")
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
            ? "Pas de domaine professionnel correspondant"
            : "Commencez à écrire..."
        }
        placeholder="Libellé domaine professionnel"
      />
    </>
  );
};

export { AsyncDomaineProfessionnelSearch };
