import _ from "lodash";
import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import type { OptionType} from 'shared/schema/optionSchema';

import { client } from "@/api.client";
import type { Discipline } from "@/app/(wrapped)/intentions/types";

type Options = (typeof client.infer)["[GET]/discipline/search/:search"];

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
  defaultValue?: OptionType;
  active?: boolean;
  inError: boolean;
  onChange: (value?: Discipline) => void;
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

  const searchDiscipline = _.debounce((inputValue: string, callback: (options: Options) => void) => {
    if (inputValue.length >= 3) {
      client
        .ref("[GET]/discipline/search/:search")
        .query({ params: { search: inputValue } })
        .then((options) => callback(options));
    }
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
        } as (typeof client.infer)["[GET]/discipline/search/:search"][number])
      }
      loadOptions={searchDiscipline}
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
