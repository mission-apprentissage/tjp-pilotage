import { useId } from "react";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { hasRole } from "shared";

import { client } from "@/api.client";
import type {Etablissement} from '@/app/(wrapped)/intentions/types';
import { useAuth } from "@/utils/security/useAuth";

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
  const { auth } = useAuth();
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: inError ? "red" : undefined,
    }),
  };
  const isPerdir = hasRole({ user: auth?.user, role: "perdir" });

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
        } as (typeof client.infer)["[GET]/etablissement/perdir/search/:search"][0])
      }
      defaultOptions={isPerdir}
      loadOptions={(inputValue: string) => {
        if (inputValue.length >= 3 || isPerdir)
          return client
            .ref("[GET]/etablissement/perdir/search/:search")
            .query({ params: { search: inputValue }, query: {} });
      }}
      loadingMessage={({ inputValue }) =>
        inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
      }
      isClearable={true}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Pas d'établissement correspondant à votre UAI" : "Commencez à écrire..."
      }
      placeholder="UAI, nom de l'établissement ou commune"
      isDisabled={disabled}
    />
  );
};
