import _ from "lodash";
import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";
import type { Etablissement } from "@/app/(wrapped)/intentions/types";

type Options = (typeof client.infer)["[GET]/etablissement/search/:search"];

export const UaiAutocomplete = ({
  id = "uai-autocomplete",
  name,
  defaultValue,
  disabled,
  inError,
  onChange,
}: {
  id?: string;
  name: string;
  defaultValue?: { value: string; label?: string; commune?: string };
  disabled?: boolean;
  inError: boolean;
  onChange: (value?: Etablissement) => void;
}) => {
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: inError ? "red" : undefined,
    }),
  };

  const searchEtablissement = _.debounce((inputValue: string, callback: (options: Options) => void) => {
    if (inputValue.length >= 3) {
      client
        .ref("[GET]/etablissement/perdir/search/:search")
        .query({ params: { search: inputValue }, query: {} })
        .then(options => callback(options));
    }
  }, 300);

  return (
    <AsyncSelect
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
        } as (typeof client.infer)["[GET]/etablissement/search/:search"][0])
      }
      loadOptions={searchEtablissement}
      loadingMessage={({ inputValue }) =>
        inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
      }
      isClearable={true}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Pas d'établissement correspondant" : "Commencez à écrire..."
      }
      placeholder="UAI, nom de l'établissement ou commune"
      isDisabled={disabled}
    />
  );
};
