import { Flex, Skeleton } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";

import { client } from "../../../../../../../api.client";
import { useEtablissementContext } from "../../../context/etablissementContext";
import { AnalyseDetaillee } from "../../analyse-detaillee/types";
import { useEtablissementMapContext } from "../context/etablissementMapContext";

type CfdSearchResult =
  (typeof client.infer)["[GET]/diplome/search/:search"][number];

const formatOffreToCfdSearchResult = (
  offre: AnalyseDetaillee["formations"][number] | undefined
): CfdSearchResult => ({
  value: offre?.cfd || "",
  label: offre?.libelleFormation || "",
  // Hard set à false ici, parce que nous n'en aurons pas besoin pour le filtre ici
  isSpecialite: false,
  isOption: false,
  isFCIL: false,
});

export const CfdSelect = () => {
  const offre = useSearchParams().get("offre");
  const { analyseDetaillee } = useEtablissementContext();
  const { setCfdFilter } = useEtablissementMapContext();
  const analyseDetailleeOffre =
    analyseDetaillee && offre ? analyseDetaillee?.formations[offre] : undefined;
  const [selected, setSelected] = useState<CfdSearchResult>();

  const onChange = (newValue: CfdSearchResult) => {
    setSelected(newValue);
  };

  const defaultValue: CfdSearchResult = useMemo(
    () => formatOffreToCfdSearchResult(analyseDetailleeOffre),
    [offre, analyseDetailleeOffre]
  );

  useEffect(() => {
    if (selected) {
      console.log(selected);
      setCfdFilter(selected.value);
    }
  }, [selected]);

  useEffect(() => {
    if (analyseDetailleeOffre) {
      console.log(analyseDetailleeOffre.cfd);
      setCfdFilter(analyseDetailleeOffre.cfd);
    }
  }, [analyseDetailleeOffre]);

  const loadOptions = async (search: string) => {
    const cfdAnalyseDetaillee = Object.values(
      analyseDetaillee?.formations ?? {}
    ).map(formatOffreToCfdSearchResult);

    const searchResults = cfdAnalyseDetaillee.filter(
      (cfd) =>
        cfd.label.toLowerCase().includes(search.toLowerCase()) ||
        cfd.value.toLowerCase().includes(search.toLowerCase())
    );
    let queryResult: CfdSearchResult[] = [];

    if (search.length >= 3)
      queryResult = await client
        .ref("[GET]/diplome/search/:search")
        .query({ params: { search } });

    return [...searchResults, ...queryResult];
  };

  return (
    <>
      {!offre || (!analyseDetaillee && <Skeleton />)}
      {offre && analyseDetaillee && (
        <AsyncSelect
          // Ce hack ici permet de rentre le rendu du composant async select dépendant de
          // l'offre sélectionnée dans analyse detaillée
          key={`cfd-select-${offre}`}
          name="MapCfdSelect"
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
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
          placeholder="Code diplôme ou libellé"
          isDisabled={!analyseDetaillee}
        />
      )}
    </>
  );
};
