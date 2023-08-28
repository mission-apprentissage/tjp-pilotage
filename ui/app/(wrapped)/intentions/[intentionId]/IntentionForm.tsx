"use client";

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { CfdInput } from "./CfdInput";
import { forms } from "./defaultFormValues";
import { UaiBlock } from "./UaiBlock";

export const IntentionForm = () => {
  const [step, setStep] = useState(1);

  const [intention, setIntention] = useState(forms);

  return (
    <Box flex={1} bg="#E2E7F8">
      <Box maxW="900px" mx="auto" width="100%" mt="10" mb="20">
        <UaiBlock
          onOpen={() => setStep(1)}
          active={step === 1}
          defaultValues={intention[1]}
          onSubmit={(values) => {
            setIntention({ ...intention, 1: values });
            setStep(2);
          }}
        />
        <Collapse in={step === 2} animateOpacity>
          <InformationsBlock
            onSubmit={(values) => {
              const newIntention = { ...intention, 2: values };
              setIntention(newIntention);
              console.log(newIntention);
            }}
            defaultValues={intention[2]}
          />
        </Collapse>
      </Box>
    </Box>
  );
};

const InformationsBlock = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: typeof forms["2"];
  onSubmit: (values: typeof forms[2]) => void;
}) => {
  const form = useForm({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = form;

  const motif = watch("motif");

  return (
    <FormProvider {...form}>
      <Box
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        as="form"
        p="6"
        mt="6"
        borderRadius={6}
      >
        <Heading as="h2" fontSize="xl">
          Type de demande
        </Heading>
        <Divider pt="4" mb="4" />
        <FormControl mb="4" maxW="500px" isInvalid={!!errors.type} isRequired>
          <FormLabel>Ma demande concerne</FormLabel>
          <Select
            bg="white"
            {...register("type", {
              required: "Le type de demande est obligatoire",
            })}
            placeholder="Séléctionner une option"
          >
            <option value="ouverture">Ouverture</option>
            <option value="fermeture">Fermeture</option>
            <option value="augmentation">Augmentation</option>
            <option value="diminution">Diminution</option>
          </Select>
          {errors.type && (
            <FormErrorMessage>{errors.type.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb="4" isInvalid={!!errors.motif} isRequired maxW="500px">
          <FormLabel>Merci de préciser le(s) motif(s)</FormLabel>
          <Controller
            name="motif"
            control={control}
            defaultValue={defaultValues.motif}
            rules={{ required: "Le motif est obligatoire" }}
            render={({ field: { onChange, value, onBlur } }) => (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]}>
                  {[
                    { label: "Taux d’emploi favorable", value: "1" },
                    { label: "Taux de poursuite favorable", value: "2" },
                    {
                      label: "Besoins recrutements avérés localement",
                      value: "3",
                    },
                    {
                      label: "Métiers 2030 Texte de description additionnel",
                      value: "4",
                    },
                    { label: "Parcours pédagogique", value: "5" },
                    { label: "Maintien pour public spécifique", value: "6" },
                    { label: "Nouvel établissement", value: "7" },
                    { label: "Établissement privé sous contrat", value: "8" },
                    {
                      label: "Fermeture / diminution en compensation",
                      value: "9",
                    },
                    { label: "Autre motif (veuillez préciser)", value: "10" },
                  ].map(({ value, label }) => (
                    <Checkbox
                      isRequired={false}
                      key={value}
                      onBlur={onBlur}
                      value={value}
                    >
                      {label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
          />
          {errors.motif && (
            <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>
          )}
        </FormControl>

        <Collapse in={(motif as string[]).includes("10")} unmountOnExit>
          <FormControl
            mb="4"
            maxW="500px"
            isInvalid={!!errors.autreMotif}
            isRequired
          >
            <FormLabel>Autre motif</FormLabel>
            {(motif as string[]).includes("10") && (
              <Textarea
                {...register("autreMotif", {
                  shouldUnregister: true,
                  required: "Veuillez préciser votre motif",
                })}
              />
            )}
            {errors.autreMotif && (
              <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>
            )}
          </FormControl>
        </Collapse>

        <FormControl mb="4" maxW="500px" isInvalid={!!errors.observation}>
          <FormLabel>Observation</FormLabel>
          <Textarea {...register("observation", {})} />
          {errors.observation && (
            <FormErrorMessage>{errors.observation.message}</FormErrorMessage>
          )}
        </FormControl>

        <Heading as="h2" fontSize="xl" mt="8">
          Diplôme concerné
        </Heading>
        <Divider pt="4" mb="4" />
        <CfdInput />

        <Heading as="h2" fontSize="xl" mt="8">
          Renseignements complémentaires
        </Heading>
        <Divider pt="4" mb="4" />
        <FormControl mb="4" isInvalid={!!errors.coloration} isRequired>
          <FormLabel>Coloration</FormLabel>
          <Controller
            name="coloration"
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
          {errors.coloration && (
            <FormErrorMessage>{errors.coloration?.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          mb="4"
          isInvalid={!!errors.poursuitePedagogique}
          isRequired
        >
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
        <Flex mt="10" mb="4">
          <Button variant="primary" type="submit">
            Envoyer
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
};
