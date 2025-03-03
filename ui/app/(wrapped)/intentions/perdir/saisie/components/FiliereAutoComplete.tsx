import _ from "lodash";
import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import type { OptionType} from 'shared/schema/optionSchema';

import { client } from "@/api.client";
import type {Filiere} from '@/app/(wrapped)/intentions/perdir/saisie/types';

type Options = (typeof client.infer)["[GET]/filiere/search/:search"];

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

  const searchFiliere = _.debounce((inputValue: string, callback: (options: Options) => void) => {
    client
      .ref("[GET]/filiere/search/:search")
      .query({ params: { search: inputValue } })
      .then((options) => callback(options));
  }, 300);

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
      loadOptions={searchFiliere}
      defaultOptions
      isClearable={true}
      noOptionsMessage={({ inputValue }) => (inputValue ? "Pas de filière correspondante" : "Commencez à écrire...")}
      placeholder="Filière"
      isDisabled={active === false}
      formatCreateLabel={(inputValue) => `Créer la filière "${inputValue}"`}
    />
  );
};
