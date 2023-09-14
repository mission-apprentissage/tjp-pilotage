import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

const labels = {
  1: "Taux d’emploi favorable",
  2: "Taux de poursuite favorable",
  3: "Besoins recrutements avérés localement",
  4: "Métiers 2030 Texte de description additionnel",
  5: "Parcours pédagogique",
  6: "Maintien pour public spécifique",
  7: "Nouvel établissement",
  8: "Établissement privé sous contrat",
  9: "Fermeture / diminution en compensation",
  10: "Autre motif (veuillez préciser)",
};

const motifs = {
  ouverture: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  ouverture_compensation: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  fermeture: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  augmentation: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  diminution: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  fcil: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
};

const getMotifOptions = (typeDemande: keyof typeof motifs) => {
  return Object.entries(labels)
    .filter(([key]) => motifs[typeDemande]?.includes(key))
    .map(([value, label]) => ({
      value,
      label,
    }));
};

export const MotifField = () => {
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<IntentionForms[2]>();

  const [typeDemande] = watch(["typeDemande"]);
  console.log(typeDemande);

  if (!typeDemande) return <></>;

  return (
    <FormControl mb="4" isInvalid={!!errors.motif} isRequired maxW="500px">
      <FormLabel>Merci de préciser le(s) motif(s)</FormLabel>
      <Controller
        name="motif"
        control={control}
        rules={{ required: "Le motif est obligatoire" }}
        render={({ field: { onChange, value, onBlur } }) => (
          <CheckboxGroup onChange={onChange} value={value}>
            <Stack spacing={[3]}>
              {getMotifOptions(typeDemande as keyof typeof motifs)?.map(
                ({ value, label }) => (
                  <Checkbox
                    isRequired={false}
                    key={value}
                    onBlur={onBlur}
                    value={value}
                  >
                    {label}
                  </Checkbox>
                )
              )}
            </Stack>
          </CheckboxGroup>
        )}
      />
      {errors.motif && (
        <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
