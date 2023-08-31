import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const ComplementaireSection = () => {
  const {
    formState: { errors },
    control,
    register,
    watch,
  } = useFormContext<IntentionForms[2]>();

  const [type, coloration] = watch(["typeDemande", "coloration"]);

  return (
    <>
      <Heading as="h2" fontSize="xl" mt="8">
        Renseignements complémentaires
      </Heading>
      <Divider pt="4" mb="4" />
      {type !== "fcil" && (
        <FormControl
          maxW="500px"
          mb="4"
          isInvalid={!!errors.coloration}
          isRequired
        >
          <FormLabel>Coloration</FormLabel>
          <Controller
            name="coloration"
            control={control}
            shouldUnregister={true}
            rules={{ required: "Ce champ est obligatoire" }}
            render={({ field: { onChange, ref, name, onBlur, value } }) => (
              <RadioGroup
                as={Stack}
                onChange={onChange}
                ref={ref}
                name={name}
                onBlur={onBlur}
                value={value}
              >
                <Radio value="true">Oui</Radio>
                <Radio value="false">Non</Radio>
              </RadioGroup>
            )}
          />
          {errors.coloration && (
            <FormErrorMessage>{errors.coloration.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
      {coloration === "true" && (
        <FormControl
          maxW="500px"
          mb="4"
          isInvalid={!!errors.libelleColoration}
          isRequired
        >
          <FormLabel>Libellé coloration</FormLabel>
          <Input
            {...register("libelleColoration", {
              shouldUnregister: true,
              required: "Ce champ est obligatoire",
            })}
          />
          {errors.libelleColoration && (
            <FormErrorMessage>
              {errors.libelleColoration?.message}
            </FormErrorMessage>
          )}
        </FormControl>
      )}
      <FormControl mb="4" isInvalid={!!errors.poursuitePedagogique} isRequired>
        <FormLabel>Poursuite Pédagogique</FormLabel>
        <Controller
          name="poursuitePedagogique"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field: { onChange, value, ref, name, onBlur } }) => (
            <RadioGroup
              as={Stack}
              onChange={onChange}
              value={value}
              ref={ref}
              name={name}
              onBlur={onBlur}
            >
              <Radio value="true">Oui</Radio>
              <Radio value="false">Non</Radio>
            </RadioGroup>
          )}
        />
        {errors.poursuitePedagogique && (
          <FormErrorMessage>
            {errors.poursuitePedagogique?.message}
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl mb="4" isInvalid={!!errors.amiCma} isRequired>
        <FormLabel>AMI / CMA</FormLabel>
        <Controller
          name="amiCma"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup as={Stack} onChange={onChange} value={value}>
              <Radio value="true">Oui</Radio>
              <Radio value="false">Non</Radio>
            </RadioGroup>
          )}
        />
        {errors.amiCma && (
          <FormErrorMessage>{errors.amiCma?.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl mb="4" maxW="500px" isInvalid={!!errors.commentaire}>
        <FormLabel>Observation</FormLabel>
        <Textarea {...register("commentaire", {})} />
        {errors.commentaire && (
          <FormErrorMessage>{errors.commentaire.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};
