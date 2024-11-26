import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";

export const CampusAutocompleteInput = ({
  name,
  defaultValue,
  active,
  inError,
  onChange,
}: {
  name: string;
  defaultValue?: { value: string; label?: string };
  active?: boolean;
  inError: boolean;
  onChange: (value?: (typeof client.infer)["[GET]/campus/search/:search"][number]) => void;
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
      loadOptions={(inputValue: string) =>
        client.ref("[GET]/campus/search/:search").query({ params: { search: inputValue } })
      }
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
