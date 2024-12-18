import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import type { OptionSchema } from "shared/schema/optionSchema";

import { client } from "@/api.client";

export const FiliereAutoCompleteInput = ({
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  name: string;
  defaultValue?: OptionSchema;
  active?: boolean;
  inError: boolean;
  onChange: (value?: (typeof client.infer)["[GET]/filiere/search/:search"][number]) => void;
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
      width: "35rem",
    }),
  };

  return (
    <AsyncCreatableSelect
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
        } as (typeof client.infer)["[GET]/filiere/search/:search"][number])
      }
      loadOptions={(inputValue: string) =>
        client.ref("[GET]/filiere/search/:search").query({ params: { search: inputValue } })
      }
      defaultOptions
      isClearable={true}
      noOptionsMessage={({ inputValue }) => (inputValue ? "Pas de filière correspondante" : "Commencez à écrire...")}
      placeholder="Filière"
      isDisabled={active === false}
      formatCreateLabel={(inputValue) => `Créer la filière "${inputValue}"`}
    />
  );
};
