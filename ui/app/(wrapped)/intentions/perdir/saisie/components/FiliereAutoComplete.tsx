import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import type { OptionType} from 'shared/schema/optionSchema';

import { client } from "@/api.client";
import type {Filiere} from '@/app/(wrapped)/intentions/perdir/saisie/types';

export const FiliereAutoCompleteInput = ({
  id = "cfd-autocomplete",
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  id?: string;
  name: string;
  defaultValue?: OptionType;
  active?: boolean;
  inError: boolean;
  onChange: (value?: Filiere) => void;
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
