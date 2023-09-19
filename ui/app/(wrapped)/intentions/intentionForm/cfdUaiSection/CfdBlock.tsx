import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
  Tag,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdBlock = ({
  setDispositifs,
  defaultDiplome,
  defaultValues,
  defaultOptions = [],
  onSubmit,
  active,
}: {
  setDispositifs: (
    info?: ApiType<typeof api.searchDiplome>[number]["dispositifs"]
  ) => void;
  defaultDiplome: ApiType<typeof api.getDemande>["metadata"]["formation"];
  defaultValues: PartialIntentionForms[1];
  defaultOptions?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
  onSubmit: (values: PartialIntentionForms[1]) => void;
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
        isInvalid={!!errors.cfd?.message}
        isRequired
        flex="1"
        w="md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <LightMode>
          <FormLabel>Recherche d'un diplôme</FormLabel>
          <Box color="chakra-body-text" minW="700px">
            <Controller
              name="cfd"
              control={control}
              rules={{ required: "Ce champs est obligatoire" }}
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
                    onSubmit({
                      uai: defaultValues.uai,
                      cfd: selected?.value,
                      libelleDiplome: selected?.label,
                      dispositifId: defaultValues.dispositifId,
                    });
                  }}
                  defaultValue={
                    defaultDiplome &&
                    ({
                      value,
                      label: defaultDiplome?.libelle,
                      isFamille: false,
                      isSecondeCommune: false,
                      dateFermeture: "",
                      dispositifs: defaultOptions,
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
