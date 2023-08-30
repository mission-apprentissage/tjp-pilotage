import {
  Checkbox,
  CheckboxGroup,
  Collapse,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const TypeDemandeSection = ({
  defaultValues,
}: {
  defaultValues: IntentionForms["2"];
}) => {
  const {
    formState: { errors },
    control,
    register,
    watch,
  } = useFormContext<IntentionForms[2]>();

  const [motif] = watch(["motif"]);

  return (
    <>
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
          placeholder="Sélectionner une option"
        >
          <option value="ouverture">Ouverture</option>
          <option value="fermeture">Fermeture</option>
          <option value="augmentation">Augmentation</option>
          <option value="diminution">Diminution</option>
          <option value="fcil">FCIL</option>
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

      <Collapse in={(motif as string[])?.includes("10")} unmountOnExit>
        <FormControl
          mb="4"
          maxW="500px"
          isInvalid={!!errors.autreMotif}
          isRequired
        >
          <FormLabel>Autre motif</FormLabel>
          {(motif as string[])?.includes("10") && (
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
    </>
  );
};
