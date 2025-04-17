import _ from "lodash";
import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import type { OptionType} from 'shared/schema/optionSchema';

import { client } from "@/api.client";
import type { Campus } from "@/app/(wrapped)/demandes/saisie/types";

type Options = (typeof client.infer)["[GET]/campus/search/:search"];

export const CampusAutocompleteInput = ({
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  name: string;
  defaultValue?: OptionType;
  active?: boolean;
  inError: boolean;
  onChange: (value?: Campus) => void;
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

  const searchCampus = _.debounce(
    (inputValue: string, callback: (options: Options) => void) => {
      client.ref("[GET]/campus/search/:search")
        .query({ params: { search: inputValue } })
        .then(options => callback(options));
    }, 300);

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
        } as (typeof client.infer)["[GET]/campus/search/:search"][number])
      }
      loadOptions={searchCampus}
      defaultOptions
      loadingMessage={({ inputValue }) =>
        inputValue.length >= 1 ? "Recherche..." : "Veuillez rentrer au moins 1 lettre"
      }
      isClearable={true}
      noOptionsMessage={({ inputValue }) => (inputValue ? "Pas de campus correspondant" : "Commencez à écrire...")}
      placeholder="Nom"
      isDisabled={active === false}
    />
  );
};
