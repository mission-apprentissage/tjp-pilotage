import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { ReactNode } from "react";
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
        maxW="1000px"
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
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
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
                      isFamille: false,
                      isSecondeCommune: false,
                      dateFermeture: "",
                      dispositifs: defaultOptions,
                    }
                  : undefined
              }
              loadOptions={(search) =>
                api.searchDiplome({ params: { search } }).call()
              }
              formatOptionLabel={(option) => {
                const Tag = ({
                  children,
                  type = "specialite",
                }: {
                  children: ReactNode;
                  type: "specialite" | "secondeCommune" | "fermeture";
                }) => {
                  let bgColor;
                  if (type === "specialite") bgColor = "blue.200";
                  else if (type === "secondeCommune") bgColor = "orange.200";
                  else bgColor = "red.200";
                  return (
                    <Box
                      borderRadius={5}
                      bg={bgColor}
                      color={"white"}
                      px={2}
                      pb={1}
                      mx={2}
                      height={7}
                      whiteSpace={"nowrap"}
                    >
                      {children}
                    </Box>
                  );
                };
                if (option.isFamille) {
                  return option.isSecondeCommune ? (
                    <Flex>
                      {option.label}{" "}
                      <Tag type="secondeCommune">Seconde commune</Tag>
                    </Flex>
                  ) : (
                    <Flex>
                      {option.label} <Tag type="specialite">Spécialité</Tag>
                      {option.dateFermeture && (
                        <Tag type="fermeture">
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
                      <Tag type="fermeture">
                        Fermeture au {option.dateFermeture}
                      </Tag>
                    )}
                  </Flex>
                );
              }}
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
