import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { PartialIntentionForms } from "../intentionForm/defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const UaiAutocomplete = ({
  name,
  value,
  defaultValues,
  formMetadata,
  active,
  inError,
  type = "demande",
  setUaiInfo,
  onSubmit,
  onChange,
}: {
  name: string;
  value?: string;
  defaultValues?: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  active?: boolean;
  inError: boolean;
  type?: "demande" | "compensation";
  setUaiInfo: (info?: ApiType<typeof api.searchEtab>[number]) => void;
  onSubmit: (values: PartialIntentionForms) => void;
  onChange: (value?: string) => void;
}) => {
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: inError ? "red" : undefined,
    }),
  };

  return (
    <AsyncSelect
      name={name}
      styles={selectStyle}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      onChange={(selected) => {
        onChange(selected?.value);
        setUaiInfo(selected ?? undefined);
        onSubmit({
          uai: selected?.value,
          cfd:
            type === "demande"
              ? defaultValues?.cfd
              : defaultValues?.compensationCfd,
          dispositifId:
            type === "demande"
              ? defaultValues?.dispositifId
              : defaultValues?.compensationDispositifId,
        });
      }}
      defaultValue={
        (formMetadata?.etablissement ||
          formMetadata?.etablissementCompensation) &&
        ({
          value,
          label:
            type === "demande"
              ? `${formMetadata?.etablissement?.libelle} - ${formMetadata?.etablissement?.commune}`
              : formMetadata?.etablissementCompensation?.libelle,
          commune:
            type === "demande"
              ? formMetadata?.etablissement?.commune
              : formMetadata?.etablissementCompensation?.commune,
        } as ApiType<typeof api.searchEtab>[0])
      }
      loadOptions={(inputValue: string) => {
        if (inputValue.length >= 3)
          return api.searchEtab({ params: { search: inputValue } }).call();
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
      placeholder="UAI, nom, commune"
      isDisabled={active === false}
    />
  );
};
