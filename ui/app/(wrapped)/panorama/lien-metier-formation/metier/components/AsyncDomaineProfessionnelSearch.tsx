"use client";

import { Flex,Text } from "@chakra-ui/react";
import _ from "lodash";
import { useId, useRef } from "react";
import type { GroupBase, SelectInstance } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { DomaineProfessionnelOption } from "@/app/(wrapped)/panorama/lien-metier-formation/metier/page";
import { TooltipIcon } from "@/components/TooltipIcon";

type Options = (typeof client.infer)["[GET]/domaine-professionnel/search/:search"];

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
    useRef<SelectInstance<DomaineProfessionnelOption, false, GroupBase<DomaineProfessionnelOption>>>(null);

  const openSelect = () => {
    if (selectElementRef.current) selectElementRef.current.openMenu("first");
  };
  const { data: defaultDomaineProfessionnelValue } = client
    .ref("[GET]/domaine-professionnel/search/:search")
    .useQuery({ params: { search: "" } });

  const searchDomaineProfessionnel = _.debounce((inputValue: string, callback: (options: Options) => void) => {
    if (inputValue.length >= 3) {
      client
        .ref("[GET]/domaine-professionnel/search/:search")
        .query({ params: { search: inputValue } })
        .then(options => callback(options));
    }
  }, 300);

  return (
    <Flex direction="column" gap={2}>
      <Text as="label" onClick={openSelect} pb="4px" cursor="pointer" htmlFor="select-domaine-professionnel">
        Domaine professionnel
        <TooltipIcon ml="1" label="" onClick={() => openGlossaire("domaine-professionnel-emploi")} />
      </Text>
      <AsyncSelect
        inputId="select-domaine-professionnel"
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
        loadOptions={searchDomaineProfessionnel}
        loadingMessage={({ inputValue }) =>
          inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
        }
        isClearable={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "Pas de domaine professionnel correspondant" : "Commencez à écrire..."
        }
        placeholder="Libellé domaine professionnel"
      />
    </Flex>
  );
};

export { AsyncDomaineProfessionnelSearch };
