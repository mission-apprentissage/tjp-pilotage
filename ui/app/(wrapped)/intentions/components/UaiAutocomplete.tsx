import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../api.client";

export const cfdRegex = /^[0-9]{8}$/;

export const UaiAutocomplete = ({
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  name: string;
  defaultValue?: { value: string; label: string; commune?: string };
  active?: boolean;
  inError: boolean;
  onChange: (value?: ApiType<typeof api.searchEtab>[number]) => void;
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
        } as ApiType<typeof api.searchEtab>[0])
      }
      loadOptions={(inputValue: string) => {
        if (inputValue.length >= 3)
          return api.searchEtab({ params: { search: inputValue } }).call();
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
      placeholder="UAI, nom, commune"
      isDisabled={active === false}
    />
  );
};
