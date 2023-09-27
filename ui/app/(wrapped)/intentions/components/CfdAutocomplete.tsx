import { Flex, Tag } from "@chakra-ui/react";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../api.client";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdAutocompleteInput = ({
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  name: string;
  defaultValue?: { value: string; label: string };
  active?: boolean;
  inError: boolean;
  onChange: (value?: ApiType<typeof api.searchDiplome>[number]) => void;
}) => {
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: inError ? "red" : undefined,
    }),
  };

  return (
    <AsyncSelect
      name={name}
      styles={selectStyle}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      onChange={(selected) => {
        onChange(selected ?? undefined);
      }}
      defaultValue={
        defaultValue &&
        ({
          ...defaultValue,
          isSpecialite: false,
          dateFermeture: "",
          dispositifs: [],
        } as ApiType<typeof api.searchDiplome>[0])
      }
      loadOptions={(search) => {
        if (search.length >= 3)
          return api.searchDiplome({ params: { search } }).call();
      }}
      formatOptionLabel={(option) => {
        return (
          <Flex>
            {option.label}{" "}
            {option.isSpecialite && (
              <Tag colorScheme={"blue"} size={"md"} ms={2}>
                Spécialité
              </Tag>
            )}
            {option.dateFermeture && (
              <Tag colorScheme={"red"} size={"md"} ms={2}>
                Fermeture au {option.dateFermeture}
              </Tag>
            )}
          </Flex>
        );
      }}
      loadingMessage={({ inputValue }) =>
        inputValue.length >= 3
          ? "Recherche..."
          : "Veuillez rentrer au moins 3 lettres"
      }
      isClearable={true}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Pas de diplôme correspondant" : "Commencez à écrire..."
      }
      placeholder="Code diplôme ou libellé"
      isDisabled={active === false}
    />
  );
};
