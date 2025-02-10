import { Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import {TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

import { client } from "@/api.client";
import type { AnalyseDetaillee } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";
import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";
import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";
import { themeDefinition } from "@/theme/theme";

type TCfdSearchResult = (typeof client.infer)["[GET]/diplome/search/:search"][number];

interface Option {
  label: string;
  value: string;
  isSpecialite: boolean;
  dateFermeture?: string;
  isOption: boolean;
  is1ereCommune: boolean;
  is2ndeCommune: boolean;
}

const formatOffreToCfdSearchResult = (offre: AnalyseDetaillee["formations"][number] | undefined): TCfdSearchResult => ({
  value: offre?.cfd ? offre?.cfd : "",
  label: offre?.libelleFormation
    ? `${offre?.libelleFormation} (${offre?.libelleDispositif ?? ""}) (${offre?.cfd})`
    : "",
  // Hard set à false ici, parce que nous n'en aurons pas besoin pour le filtre ici
  isSpecialite: false,
  isOption: false,
  isFCIL: false,
  is1ereCommune: false,
  is2ndeCommune: false,
  //
  libelleFormation: offre?.libelleFormation || "",
  libelleNiveauDiplome: offre?.libelleNiveauDiplome || "",
  cfd: offre?.cfd || "",
});

const formatSearchResultToOption = (cfdSearchResult: TCfdSearchResult): Option => ({
  label: `${cfdSearchResult.libelleNiveauDiplome} ${cfdSearchResult.libelleFormation} (${cfdSearchResult.cfd})`,
  value: cfdSearchResult.value,
  isSpecialite: cfdSearchResult.isSpecialite,
  dateFermeture: cfdSearchResult.dateFermeture,
  isOption: cfdSearchResult.isOption,
  is1ereCommune: cfdSearchResult.is1ereCommune,
  is2ndeCommune: cfdSearchResult.is2ndeCommune,
});

export const CfdSelect = () => {
  const offre = useSearchParams().get("offre");
  const { analyseDetaillee } = useEtablissementContext();
  const { setCfdFilter } = useEtablissementMapContext();
  const analyseDetailleeOffre = analyseDetaillee && offre ? analyseDetaillee?.formations[offre] : undefined;
  const [selected, setSelected] = useState<Option>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const trackEvent = usePlausible();

  const onChange = (newValue: Option) => {
    setSelected(newValue);

    trackEvent("cartographie-etablissement:interaction", {
      props: {
        type: "cartographie-cfd-select",
        value: newValue,
      },
    });
  };

  const isDefaultSelected = analyseDetailleeOffre?.cfd === selected?.value;

  const defaultValue: Option = useMemo(
    () => formatSearchResultToOption(formatOffreToCfdSearchResult(analyseDetailleeOffre)),
    // TODO: REFACTO
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offre, analyseDetailleeOffre]
  );

  useEffect(() => {
    if (selected) {
      setCfdFilter(selected.value);
    }
    // TODO: REFACTO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (analyseDetailleeOffre) {
      setCfdFilter(analyseDetailleeOffre.cfd);
      setSelected(formatSearchResultToOption(formatOffreToCfdSearchResult(analyseDetailleeOffre)));
    }
    // TODO: REFACTO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyseDetailleeOffre]);

  const loadOptions = async (search: string) => {
    const cfdAnalyseDetaillee = Object.values(analyseDetaillee?.formations ?? {}).map(formatOffreToCfdSearchResult);

    const searchResults = _.uniqBy(
      cfdAnalyseDetaillee.filter(
        (cfd) =>
          cfd.label.toLowerCase().includes(search.toLowerCase()) ||
          cfd.value.toLowerCase().includes(search.toLowerCase())
      ),
      "value"
    );
    const queryResult: TCfdSearchResult[] = await client
      .ref("[GET]/diplome/search/:search")
      .query({ params: { search }, query: {} });

    const filteredQueryResult = queryResult.filter(
      (result) => searchResults.findIndex((local) => local.value === result.value) === -1
    );

    return [
      {
        label: `FORMATIONS DE L'ÉTABLISSEMENT (${searchResults.length})`,
        options: searchResults.map(formatSearchResultToOption),
      },
      {
        label: `AUTRES (${filteredQueryResult.length}${filteredQueryResult.length === 20 && "+"})`,
        options: filteredQueryResult.map(formatSearchResultToOption),
      },
    ];
  };

  const getFormationTypeFamille = (option: Option): TypeFamilleKeys | undefined => {
    if (option.isSpecialite) {
      return TypeFamilleEnum["specialite"];
    }

    if (option.isOption) {
      return TypeFamilleEnum["option"];
    }

    if (option.dateFermeture) {
      return "fermeture";
    }

    if (option.is1ereCommune) {
      return TypeFamilleEnum["1ere_commune"];
    }

    if (option.is2ndeCommune) {
      return TypeFamilleEnum["2nde_commune"];
    }

    return undefined;
  };

  return (
    <>
      {!offre || (!analyseDetaillee && <Skeleton />)}
      {offre && analyseDetaillee && (
        <Stack gap="8px">
          <Text as="label" htmlFor="select-cfd-carto">Formation</Text>
          <AsyncSelect
            inputId="select-cfd-carto"
            // Rendre la key dépendente de l'offre, permet le rendu du composant à chaque fois que
            // l'offre sélectionnée dans analyse detaillée change
            key={`cfd-select-${offre}`}
            name="MapCfdSelect"
            onChange={(selected) => {
              if (selected) onChange(selected);
            }}
            defaultValue={defaultValue}
            defaultOptions={true}
            loadOptions={loadOptions}
            formatOptionLabel={(option) => {
              return (
                <Flex gap="4px">
                  <Text>{option.label} </Text>
                  <BadgeTypeFamille typeFamille={getFormationTypeFamille(option)} labelSize="short">
                    {option.dateFermeture !== undefined ? option.dateFermeture : undefined}
                  </BadgeTypeFamille>
                </Flex>
              );
            }}
            loadingMessage={({ inputValue }) => `${inputValue} est en cours de recherche...`}
            noOptionsMessage={({ inputValue }) => `${inputValue} n'a donné aucun résultat.`}
            placeholder="Code diplôme ou libellé"
            isDisabled={!analyseDetaillee}
            controlShouldRenderValue={!isMenuOpen}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
            styles={{
              groupHeading: (provided) => ({
                ...provided,
                fontWeight: "bold",
                fontSize: "12px",
                textTransform: "uppercase",
                color: themeDefinition.colors.grey[50],
              }),
              control: (baseStyles) => ({
                ...baseStyles,
                borderWidth: isDefaultSelected ? "2px" : "1px",
                borderType: "solid",
                borderColor: isDefaultSelected ? themeDefinition.colors.info[525] : baseStyles.borderColor,
              }),
            }}
          />
        </Stack>
      )}
    </>
  );
};
