import { Flex, GridItem, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "../../../../../../api.client";

export const SearchInput = ({ uai }: { uai: string }) => {
  const router = useRouter();

  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: undefined,
      zIndex: "2",
    }),
  };

  const { data: defaultEtablissementSearchValues, isLoading } = client
    .ref("[GET]/etablissement/:uai")
    .useQuery({ params: { uai: uai } });

  return (
    <GridItem colSpan={5} justifySelf={"end"}>
      <Flex zIndex={"dropdown"}>
        {isLoading ? (
          <Skeleton height="38px" width="25rem" opacity={0.25} />
        ) : (
          <AsyncSelect
            instanceId={"panorama-etablissement-uai"}
            styles={{
              ...selectStyle,
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            onChange={(selected) => selected && router.push(selected.value)}
            defaultValue={
              defaultEtablissementSearchValues &&
              ({
                ...defaultEtablissementSearchValues,
              } as (typeof client.infer)["[GET]/etablissement/search/:search"][0])
            }
            loadOptions={(inputValue: string) => {
              if (inputValue.length >= 3)
                return client.ref("[GET]/etablissement/search/:search").query({
                  params: { search: inputValue },
                  query: { filtered: true },
                });
            }}
            loadingMessage={({ inputValue }) =>
              inputValue.length >= 3
                ? "Recherche..."
                : "Veuillez rentrer au moins 3 lettres"
            }
            isClearable={true}
            noOptionsMessage={({ inputValue }) =>
              inputValue
                ? "Pas d'établissement correspondant"
                : "Commencez à écrire..."
            }
            placeholder="Rechercher un établissement par UAI, nom, commune..."
          />
        )}
      </Flex>
    </GridItem>
  );
};
