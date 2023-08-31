import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms } from "../defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdInput = ({
  onCfdInfoChange,
  cfdInfo,
}: {
  onCfdInfoChange: (info?: ApiType<typeof api.checkCfd>) => void;
  cfdInfo?: ApiType<typeof api.checkCfd>;
}) => {
  const {
    formState: { errors, isSubmitting },
    register,
    watch,
    trigger,
    getValues,
    setValue,
    resetField,
  } = useFormContext<IntentionForms["2"]>();

  const cfd = watch("cfd");
  const isValidCfd = !!cfd && cfdRegex.test(cfd);

  useEffect(() => {
    if (!cfdInfo) return;
    trigger("cfd");
  }, [cfdInfo]);

  const fetchStatus = async () => {
    const currentCfd = getValues("cfd");
    if (!currentCfd) return;
    const res = await api.checkCfd({ params: { cfd: currentCfd } }).call();
    if (res.status === "valid") {
      setValue("libelleDiplome", res.data.libelle ?? "");
    }
    onCfdInfoChange(res);
  };

  return (
    <>
      <FormControl
        mb="4"
        maxW="500px"
        isInvalid={!!errors.cfd?.message}
        isRequired
      >
        <FormLabel>Saisie du code diplôme</FormLabel>
        <Flex>
          <InputGroup>
            <Input
              {...register("cfd", {
                required: "Le code diplôme est obligatoire",
                pattern: {
                  value: cfdRegex,
                  message: "Le code diplôme n'est pas au bon format",
                },
                onChange: () => {
                  if (cfdInfo) onCfdInfoChange(undefined);
                  resetField("libelleDiplome");
                  resetField("dispositifId");
                  if (errors.cfd) trigger("cfd");
                },
                validate: {
                  as: async () => {
                    if (!cfdInfo)
                      return isSubmitting
                        ? "Veuillez valider le code diplôme"
                        : true;

                    if (cfdInfo.status !== "valid")
                      return "Le code diplôme est introuvable";

                    return true;
                  },
                },
              })}
              placeholder="Ex: 50032307"
            />
            {cfdInfo?.status === "valid" && (
              <InputRightElement bg="transparent">
                {<CheckIcon color="green" />}
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            isDisabled={!isValidCfd || !!cfdInfo}
            onClick={fetchStatus}
            ml="2"
            variant="primary"
          >
            Valider
          </Button>
        </Flex>

        {errors.cfd?.message && (
          <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
        )}
        {isValidCfd && !cfdInfo && !errors.cfd && (
          <Text color="orange.400" mt="2" fontSize="sm">
            Veuillez valider le code diplôme
          </Text>
        )}
      </FormControl>
    </>
  );
};
