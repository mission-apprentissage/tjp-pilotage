import { Flex, FormControl, FormLabel, Skeleton } from "@chakra-ui/react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

export const UaiForm = ({
  uai,
  onUaiChanged,
  inError,
}: {
  uai: string;
  onUaiChanged: (value: string) => void;
  inError: boolean;
}) => {
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      width: "25rem",
      borderColor: inError ? "red" : undefined,
      zIndex: "2",
    }),
  };

  const { isLoading } = client.ref("[GET]/etablissement/:uai").useQuery({ params: { uai: uai } });

  return (
    <FormControl margin="auto" maxW="400px" as="form">
      <FormLabel>Recherche d'un établissement</FormLabel>
      <Flex zIndex="overlay">
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
            // @ts-expect-error TODO
            onChange={(selected) => selected && onUaiChanged(selected.value)}
            loadOptions={(inputValue: string) => {
              if (inputValue.length >= 3)
                return client.ref("[GET]/etablissement/search/:search").query({
                  params: { search: inputValue },
                  query: { filtered: true },
                });
            }}
            loadingMessage={({ inputValue }) =>
              inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
            }
            isClearable={true}
            noOptionsMessage={({ inputValue }) =>
              inputValue ? "Pas d'établissement correspondant" : "Commencez à écrire..."
            }
            placeholder="UAI, nom de l'établissement ou commune"
          />
        )}
      </Flex>
    </FormControl>
  );
};
