import { Flex, Tag } from "@chakra-ui/react";
import { UseFormResetField } from "react-hook-form";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import {
  IntentionForms,
  PartialIntentionForms,
} from "../intentionForm/defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdAutocompleteInput = ({
  name,
  value,
  formMetadata,
  defaultValues,
  defaultDispositifs = [],
  active,
  inError,
  type = "demande",
  setDispositifs,
  onSubmit,
  onChange,
  resetField,
}: {
  name: string;
  value?: string;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  defaultValues?: PartialIntentionForms;
  defaultDispositifs?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
  active?: boolean;
  inError: boolean;
  type?: "demande" | "compensation";
  setDispositifs: (
    info?: ApiType<typeof api.searchDiplome>[number]["dispositifs"]
  ) => void;
  onSubmit: (values: PartialIntentionForms) => void;
  onChange: (value?: string) => void;
  resetField: UseFormResetField<IntentionForms>;
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
        if (!selected)
          resetField(
            type === "demande" ? "dispositifId" : "compensationDispositifId"
          );
        onChange(selected?.value);
        setDispositifs(selected?.dispositifs);
        onSubmit({
          uai:
            type === "demande"
              ? defaultValues?.uai
              : defaultValues?.compensationUai,
          cfd: selected?.value,
          dispositifId:
            type === "demande"
              ? defaultValues?.dispositifId
              : defaultValues?.compensationDispositifId,
        });
      }}
      defaultValue={
        (formMetadata?.formation || formMetadata?.formationCompensation) &&
        ({
          value,
          label:
            type === "demande"
              ? formMetadata?.formation?.libelle
              : formMetadata?.formationCompensation?.libelle,
          isFamille: false,
          isSecondeCommune: false,
          dateFermeture: "",
          dispositifs: defaultDispositifs,
        } as ApiType<typeof api.searchDiplome>[0])
      }
      loadOptions={(search) => {
        if (search.length >= 3)
          return api.searchDiplome({ params: { search } }).call();
      }}
      formatOptionLabel={(option) => {
        if (option.isFamille) {
          return option.isSecondeCommune ? (
            <Flex>
              {option.label}{" "}
              <Tag colorScheme={"orange"} size={"md"} ms={2}>
                Seconde commune
              </Tag>
            </Flex>
          ) : (
            <Flex>
              {option.label}{" "}
              <Tag colorScheme={"blue"} size={"md"} ms={2}>
                Spécialité
              </Tag>
              {option.dateFermeture && (
                <Tag colorScheme={"red"} size={"md"} ms={2}>
                  Fermeture au {option.dateFermeture}
                </Tag>
              )}
            </Flex>
          );
        }
        return (
          <Flex>
            {option.label}{" "}
            {option.dateFermeture && (
              <Tag colorScheme={"red"} size={"md"} ms={2}>
                Fermeture au {option.dateFermeture}
              </Tag>
            )}
          </Flex>
        );
      }}
      loadingMessage={({ inputValue }) =>
        inputValue.length >= 3
          ? "Recherche..."
          : "Veuillez rentrer au moins 3 lettres"
      }
      isClearable={true}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Pas de diplôme correspondant" : "Commencez à écrire..."
      }
      placeholder="Recherche un diplôme..."
      isDisabled={active === false}
    />
  );
};
