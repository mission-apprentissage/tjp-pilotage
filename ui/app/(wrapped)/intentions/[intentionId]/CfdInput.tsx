"use client";
import { CheckIcon, LockIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { forms } from "./defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdInput = () => {
  const {
    formState: { errors, isSubmitting },
    register,
    watch,
    trigger,
    getValues,
    setValue,
    resetField,
  } = useFormContext<typeof forms[2]>();

  const cfd = watch("cfd");
  const isValidCfd = cfdRegex.test(cfd);

  const [status, setStatus] = useState<ApiType<typeof api.checkCfd>>();
  useEffect(() => {
    if (!status) return;
    trigger("cfd");
  }, [status]);

  const fetchStatus = async () => {
    const res = await api
      .checkCfd({ params: { cfd: getValues("cfd") } })
      .call();
    if (res.status === "valid") {
      setValue("libelleDiplome", res.data.libelle ?? "");
    }
    setStatus(res);
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
                  if (status) setStatus(undefined);
                  resetField("libelleDiplome");
                  resetField("codeDispositif");
                  if (errors.cfd) trigger("cfd");
                },
                validate: {
                  as: async () => {
                    if (!status)
                      return isSubmitting
                        ? "Veuillez valider le code diplôme"
                        : true;

                    if (status.status !== "valid")
                      return "Le code diplôme est introuvable";

                    return true;
                  },
                },
              })}
              placeholder="Ex: 50032307"
            />
            {status?.status === "valid" && (
              <InputRightElement bg="transparent">
                {<CheckIcon color="green" />}
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            isDisabled={!isValidCfd || !!status}
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
        {isValidCfd && !status && !errors.cfd && (
          <Text color="orange.400" mt="2" fontSize="sm">
            Veuillez valider le code diplôme
          </Text>
        )}
      </FormControl>

      <LibelleDiplomeInput cfdStatus={status} />
      <DispositifInput cfdStatus={status} />
    </>
  );
};

export const LibelleDiplomeInput = ({
  cfdStatus,
}: {
  cfdStatus?: ApiType<typeof api.checkCfd>;
}) => {
  const {
    formState: { errors },
    register,
    setValue,
  } = useFormContext<typeof forms[2]>();

  const data = cfdStatus?.status === "valid" ? cfdStatus.data : undefined;

  useEffect(
    () => setValue("libelleDiplome", data?.libelle ?? ""),
    [data, setValue]
  );

  const disabled =
    !cfdStatus || cfdStatus.status !== "valid" || !!data?.libelle;

  return (
    <FormControl
      mb="4"
      maxW="500px"
      isInvalid={!!errors.libelleDiplome}
      isRequired
      placeholder={"Intitulé du diplôme correspondant"}
    >
      <FormLabel>Intitulé du diplôme correspondant</FormLabel>
      {disabled && (
        <InputGroup>
          <Input
            {...register("libelleDiplome", {
              required: "L'intitulé du diplôme est obligatoire",
              disabled: true,
            })}
            disabled={false}
            isReadOnly={true}
            placeholder="Ex: Accessoiriste réalisateur"
          />
          <InputRightAddon>
            <LockIcon />
          </InputRightAddon>
        </InputGroup>
      )}
      {!disabled && (
        <Input
          {...register("libelleDiplome", {
            required: "L'intitulé du diplôme est obligatoire",
          })}
          placeholder="Ex: Accessoiriste réalisateur"
        />
      )}
      {errors.libelleDiplome && (
        <FormErrorMessage>{errors.libelleDiplome.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
const DispositifInput = ({
  cfdStatus,
}: {
  cfdStatus?: ApiType<typeof api.checkCfd>;
}) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<typeof forms[2]>();

  const data = cfdStatus?.status === "valid" ? cfdStatus.data : undefined;

  return (
    <FormControl
      mb="4"
      maxW="500px"
      isInvalid={!!errors.codeDispositif}
      isRequired
    >
      <FormLabel>Dispositif</FormLabel>
      <Select
        placeholder="Séléctionner une option"
        {...register("codeDispositif", {
          required: "Le dispositif est obligatoire",
        })}
      >
        {data?.dispositifs.map(({ codeDispositif, libelleDispositif }) => (
          <option key={codeDispositif} value={codeDispositif}>
            {libelleDispositif}
          </option>
        ))}
      </Select>
      {errors.codeDispositif && (
        <FormErrorMessage>{errors.codeDispositif.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
