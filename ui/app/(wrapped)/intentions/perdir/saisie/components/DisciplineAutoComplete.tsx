import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import type { OptionSchema } from "shared/schema/optionSchema";

import { client } from "@/api.client";

export const DisciplineAutocompleteInput = ({
  id = "discipline-autocomplete",
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  id?: string;
  name: string;
  defaultValue?: OptionSchema;
  active?: boolean;
  inError: boolean;
  onChange: (value?: (typeof client.infer)["[GET]/discipline/search/:search"][number]) => void;
}) => {
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: inError ? "red" : undefined,
    }),
    input: (styles: CSSObjectWithLabel) => ({
      ...styles,
      width: "xl",
    }),
    container: (styles: CSSObjectWithLabel) => ({
      ...styles,
      width: "14rem",
    }),
  };

  return (
    <AsyncCreatableSelect
      inputId={id}
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
        } as (typeof client.infer)["[GET]/discipline/search/:search"][number])
      }
      loadOptions={(inputValue: string) => {
        if (inputValue.length >= 3)
          return client.ref("[GET]/discipline/search/:search").query({ params: { search: inputValue } });
      }}
      loadingMessage={({ inputValue }) =>
        inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
      }
      isClearable={true}
      noOptionsMessage={({ inputValue }) => (inputValue ? "Pas de discipline correspondante" : "Commencez à écrire...")}
      placeholder="Libellé ou code"
      isDisabled={active === false}
      formatCreateLabel={(inputValue) => `Créer la discipline "${inputValue}"`}
    />
  );
};
