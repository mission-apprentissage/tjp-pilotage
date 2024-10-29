import { Search2Icon } from "@chakra-ui/icons";
import { Flex, GridItem, Skeleton, useToken } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type { ControlProps, CSSObjectWithLabel } from "react-select";
import { components } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

const Control = ({
  children,
  ...props
}: ControlProps<(typeof client.infer)["[GET]/etablissement/search/:search"][0], false>) => {
  const [placeholderGrey] = useToken("colors", ["grey.625"]);

  return (
    <components.Control {...props}>
      <Search2Icon ml={2} height={"18px"} width={"18px"} color={placeholderGrey} />
      {children}
    </components.Control>
  );
};

export const SearchInput = ({ uai }: { uai: string }) => {
  const router = useRouter();

  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: undefined,
      zIndex: "2",
      width: "500px",
    }),
  };

  const { isLoading } = client.ref("[GET]/etablissement/:uai").useQuery({ params: { uai: uai } });

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
              placeholder: (styles) => ({
                ...styles,
                display: "flex",
                alignItems: "center",
              }),
            }}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              Control,
            }}
            onChange={(selected) => selected && router.push(selected.value)}
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
            placeholder="Rechercher un établissement par UAI, nom, commune..."
          />
        )}
      </Flex>
    </GridItem>
  );
};
