"use client";

import { Text } from "@chakra-ui/react";
import { useId, useRef } from "react";
import type { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { NsfOption } from "@/app/(wrapped)/panorama/lien-metier-formation/formation/page";
import { TooltipIcon } from "@/components/TooltipIcon";

interface AsyncNsfSearchProps {
  nsf?: NsfOption;
  onSelectNsf: (option?: NsfOption) => void;
}

type Option = NsfOption | string;

const AsyncNsfSearch = ({ onSelectNsf, nsf }: AsyncNsfSearchProps) => {
  const { openGlossaire } = useGlossaireContext();
  const selectElementRef = useRef<SelectInstance<Option, false, GroupBase<Option>>>(null);

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
  };

  const { data: defaultNsfValues } = client.ref("[GET]/nsf/search/:search").useQuery({ params: { search: "" } });

  return (
    <>
      <Text as="label" onClick={openSelect} pb="4px" cursor="pointer" htmlFor="select-nsf">
        Domaine de formation
        <TooltipIcon ml="1" label="" onClick={() => openGlossaire("domaine-de-formation-nsf")} />
      </Text>
      <AsyncSelect
        inputId="select-nsf"
        ref={selectElementRef}
        instanceId={useId()}
        name={"select-nsf"}
        components={{
          IndicatorSeparator: () => null,
        }}
        value={nsf ?? ""}
        onChange={(selected) => {
          if (typeof selected !== "string") onSelectNsf(selected ?? undefined);
        }}
        defaultOptions={defaultNsfValues ?? []}
        loadOptions={(inputValue: string) => {
          if (inputValue.length >= 3)
            return client.ref("[GET]/nsf/search/:search").query({ params: { search: inputValue } });
        }}
        loadingMessage={({ inputValue }) =>
          inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
        }
        isClearable={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "Pas de domaine de formation correspondant" : "Commencez à écrire..."
        }
        placeholder="Libellé domaine de formation"
      />
    </>
  );
};

export { AsyncNsfSearch };
