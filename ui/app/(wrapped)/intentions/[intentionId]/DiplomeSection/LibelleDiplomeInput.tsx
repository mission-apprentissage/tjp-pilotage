"use client";
import { LockIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { forms } from "../defaultFormValues";

export const LibelleDiplomeInput = ({
  cfdInfo,
}: {
  cfdInfo?: ApiType<typeof api.checkCfd>;
}) => {
  const {
    formState: { errors },
    register,
    setValue,
  } = useFormContext<typeof forms[2]>();

  const data = cfdInfo?.status === "valid" ? cfdInfo.data : undefined;

  useEffect(
    () => setValue("libelleDiplome", data?.libelle ?? ""),
    [data, setValue]
  );

  const disabled = !cfdInfo || cfdInfo.status !== "valid" || !!data?.libelle;

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
