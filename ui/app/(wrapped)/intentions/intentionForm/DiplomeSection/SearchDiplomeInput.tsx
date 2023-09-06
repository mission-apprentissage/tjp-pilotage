import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms } from "../defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const SearchDiplomeInput = ({
  setDispositifs,
  defaultLibelle,
  defaultOptions = [],
}: {
  setDispositifs: (
    info?: ApiType<typeof api.searchDiplome>[number]["dispositifs"]
  ) => void;
  defaultLibelle?: string;
  defaultOptions?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
}) => {
  const {
    formState: { errors },
    resetField,
    control,
  } = useFormContext<IntentionForms["2"]>();

  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: errors.cfd ? "red" : undefined,
    }),
  };

  return (
    <>
      <FormControl
        mb="4"
        maxW="500px"
        isInvalid={!!errors.cfd?.message}
        isRequired
        flex="1"
      >
        <FormLabel>Recherche d'un diplôme</FormLabel>
        <Controller
          name="cfd"
          control={control}
          rules={{ required: "Le champs est obligatoire" }}
          render={({ field: { onChange, value, name, onBlur } }) => (
            <AsyncSelect
              onBlur={onBlur}
              name={name}
              styles={selectStyle}
              onChange={(selected) => {
                if (!selected) resetField("dispositifId");
                onChange(selected?.value);
                setDispositifs(selected?.dispositifs);
              }}
              defaultValue={
                defaultLibelle !== undefined
                  ? {
                      value,
                      label: defaultLibelle,
                      dispositifs: defaultOptions,
                    }
                  : undefined
              }
              loadOptions={(search) =>
                api.searchDiplome({ params: { search } }).call()
              }
              loadingMessage={() => "Recherche..."}
              isClearable={true}
              noOptionsMessage={({ inputValue }) =>
                inputValue
                  ? "Pas de diplôme correspondant"
                  : "Commencez à écrire..."
              }
              placeholder="Recherche un diplôme..."
            />
          )}
        />
        {errors.cfd && (
          <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};
