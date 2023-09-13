import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdBlock = ({
  setDispositifs,
  defaultLibelle,
  defaultValues,
  defaultOptions = [],
  onSubmit,
  active,
}: {
  setDispositifs: (
    info?: ApiType<typeof api.searchDiplome>[number]["dispositifs"]
  ) => void;
  defaultLibelle?: string;
  defaultValues: PartialIntentionForms[1];
  defaultOptions?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
  onSubmit: (values: {
    uai?: string;
    cfd?: string;
    dispositifId?: string;
  }) => void;
  active: boolean;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    resetField,
    control,
  } = useForm<IntentionForms[1]>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

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
        onSubmit={handleSubmit(onSubmit)}
      >
        <LightMode>
          <FormLabel>Recherche d'un diplôme</FormLabel>
          <Box color="chakra-body-text">
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
                    if (selected) {
                      onSubmit({
                        uai: defaultValues.uai,
                        cfd: selected?.value,
                        dispositifId: defaultValues.dispositifId,
                      });
                    }
                  }}
                  defaultValue={
                    defaultLibelle !== undefined
                      ? ({
                          value,
                          label: defaultLibelle,
                          isFamille: false,
                          isSecondeCommune: false,
                          dateFermeture: "",
                          dispositifs: defaultOptions,
                        } as ApiType<typeof api.searchDiplome>[0])
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
                      else if (type === "secondeCommune")
                        bgColor = "orange.200";
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
                  isDisabled={!active}
                />
              )}
            />
            {errors.cfd && (
              <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
            )}
          </Box>
        </LightMode>
      </FormControl>
    </>
  );
};
