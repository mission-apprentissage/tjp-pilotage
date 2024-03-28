import { Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";

import { client } from "../../../../../../../api.client";
import { themeDefinition } from "../../../../../../../theme/theme";
import { useEtablissementContext } from "../../../context/etablissementContext";
import { AnalyseDetaillee } from "../../analyse-detaillee/types";
import { useEtablissementMapContext } from "../context/etablissementMapContext";

type TCfdSearchResult =
  (typeof client.infer)["[GET]/diplome/search/:search"][number];

interface Option {
  label: string;
  value: string;
}

const formatOffreToCfdSearchResult = (
  offre: AnalyseDetaillee["formations"][number] | undefined
): TCfdSearchResult => ({
  value: offre?.cfd ? offre?.cfd : "",
  label: offre?.libelleFormation
    ? `${offre?.libelleFormation} (${
        offre?.libelleDispositif ?? ""
      }) (${offre?.cfd})`
    : "",
  // Hard set à false ici, parce que nous n'en aurons pas besoin pour le filtre ici
  isSpecialite: false,
  isOption: false,
  isFCIL: false,
  //
  libelleFormation: offre?.libelleFormation || "",
  libelleNiveauDiplome: offre?.libelleNiveauDiplome || "",
  cfd: offre?.cfd || "",
});

const formatSearchResultToOption = (
  cfdSearchResult: TCfdSearchResult
): Option => ({
  label: `${cfdSearchResult.libelleFormation} (${cfdSearchResult.cfd})`,
  value: cfdSearchResult.value,
});

export const CfdSelect = () => {
  const offre = useSearchParams().get("offre");
  const { analyseDetaillee } = useEtablissementContext();
  const { setCfdFilter } = useEtablissementMapContext();
  const analyseDetailleeOffre =
    analyseDetaillee && offre ? analyseDetaillee?.formations[offre] : undefined;
  const [selected, setSelected] = useState<Option>();

  const onChange = (newValue: Option) => {
    setSelected(newValue);
  };

  const defaultValue: Option = useMemo(
    () =>
      formatSearchResultToOption(
        formatOffreToCfdSearchResult(analyseDetailleeOffre)
      ),
    [offre, analyseDetailleeOffre]
  );

  useEffect(() => {
    if (selected) {
      setCfdFilter(selected.value);
    }
  }, [selected]);

  useEffect(() => {
    if (analyseDetailleeOffre) {
      setCfdFilter(analyseDetailleeOffre.cfd);
    }
  }, [analyseDetailleeOffre]);

  const loadOptions = async (search: string) => {
    const cfdAnalyseDetaillee = Object.values(
      analyseDetaillee?.formations ?? {}
    ).map(formatOffreToCfdSearchResult);

    const searchResults = _.uniqBy(
      cfdAnalyseDetaillee.filter(
        (cfd) =>
          cfd.label.toLowerCase().includes(search.toLowerCase()) ||
          cfd.value.toLowerCase().includes(search.toLowerCase())
      ),
      "value"
    );
    let queryResult: TCfdSearchResult[] = [];

    if (search.length >= 3)
      queryResult = await client
        .ref("[GET]/diplome/search/:search")
        .query({ params: { search } });

    const filteredQueryResult = queryResult.filter(
      (result) =>
        searchResults.findIndex((local) => local.value === result.value) === -1
    );

    return [
      {
        label: `FORMATIONS DE L'ÉTABLISSEMENT (${searchResults.length})`,
        options: searchResults.map(formatSearchResultToOption),
      },
      {
        label: `AUTRES (${filteredQueryResult.length})`,
        options: filteredQueryResult.map(formatSearchResultToOption),
      },
    ];
  };

  return (
    <>
      {!offre || (!analyseDetaillee && <Skeleton />)}
      {offre && analyseDetaillee && (
        <Stack gap="8px">
          <Text>Formation</Text>
          <AsyncSelect
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
              return <Flex>{option.label}</Flex>;
            }}
            loadingMessage={({ inputValue }) =>
              `${inputValue} est en cours de recherche...`
            }
            noOptionsMessage={({ inputValue }) =>
              `${inputValue} n'a donné aucun résultat.`
            }
            placeholder="Code diplôme ou libellé"
            isDisabled={!analyseDetaillee}
            styles={{
              groupHeading: (provided) => ({
                ...provided,
                fontWeight: "bold",
                fontSize: "12px",
                textTransform: "uppercase",
                color: themeDefinition.colors.grey[50],
              }),
            }}
          />
        </Stack>
      )}
    </>
  );
};
