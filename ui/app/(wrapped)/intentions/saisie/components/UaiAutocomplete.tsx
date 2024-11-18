import { useId } from "react";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

export const UaiAutocomplete = ({
  name,
  defaultValue,
  disabled,
  inError,
  onChange,
}: {
  name: string;
  defaultValue?: { value: string; label?: string; commune?: string };
  disabled?: boolean;
  inError: boolean;
  onChange: (
    value?: (typeof client.infer)["[GET]/etablissement/search/:search"][number]
  ) => void;
}) => {
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: inError ? "red" : undefined,
    }),
  };

  return (
    <AsyncSelect
      instanceId={useId()}
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
        } as (typeof client.infer)["[GET]/etablissement/search/:search"][0])
      }
      loadOptions={(inputValue: string) => {
        if (inputValue.length >= 3)
          return client
            .ref("[GET]/etablissement/search/:search")
            .query({ params: { search: inputValue }, query: {} });
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
      placeholder="UAI, nom de l'établissement ou commune"
      isDisabled={disabled}
    />
  );
};
