import {
  chakra,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import { isTypeColoration } from "shared/validators/demandeValidators";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import type { Campagne } from "@/app/(wrapped)/intentions/saisie/types";
import type { MotifCampagne, MotifLabel } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getMotifsTypeDemande, MOTIFS_LABELS } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import type { TypeDemande } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import {
  getTypeDemandeLabel,
  isTypeAjustement,
  isTypeFermeture,
} from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

const getMotifOptions = (typeDemande: TypeDemande, campagne: string = CURRENT_ANNEE_CAMPAGNE) => {
  return Object.entries(MOTIFS_LABELS[campagne as MotifCampagne])
    .filter(([key]) => getMotifsTypeDemande(typeDemande)?.includes(key as MotifLabel))
    .map(([value, label]) => ({
      value,
      label,
    }));
};

export const MotifField = chakra(
  ({ disabled, campagne, className }: { disabled?: boolean; campagne?: Campagne; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("motif", []);
        }).unsubscribe
    );

    const [typeDemande, coloration] = watch(["typeDemande", "coloration"]);
    const isMotifVisible = typeDemande && !isTypeAjustement(typeDemande);

    if (!isMotifVisible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel>
          Merci de préciser le(s) motif(s) de votre {getTypeDemandeLabel(typeDemande).toLowerCase()}
        </FormLabel>
        <Controller
          name="motif"
          disabled={disabled}
          control={control}
          rules={{ required: "Le motif est obligatoire" }}
          render={({ field: { onChange, value, onBlur, ref, name, disabled } }) => {
            return (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]} ms={6}>
                  {getMotifOptions(typeDemande, campagne?.annee)?.map(({ value, label }) => (
                    <Checkbox
                      ref={ref}
                      disabled={disabled}
                      name={name}
                      key={`${name}_${label}`}
                      onBlur={onBlur}
                      value={value}
                      _checked={{ fontWeight: "bold !important" }}
                      fontWeight={"400 !important"}
                    >
                      {label}
                    </Checkbox>
                  ))}
                </Stack>
                {coloration && !isTypeColoration(typeDemande) && !isTypeFermeture(typeDemande) && (
                  <Flex direction={"column"} mt={8}>
                    <FormLabel>Merci de préciser le(s) motif(s) de votre coloration</FormLabel>
                    <Stack spacing={[3]} ms={6}>
                      {getMotifOptions("coloration", campagne?.annee)?.map(({ value, label }) => (
                        <Checkbox
                          ref={ref}
                          disabled={disabled}
                          key={`${name}_${label}_coloration`}
                          onBlur={onBlur}
                          value={value}
                          _checked={{ fontWeight: "bold !important" }}
                          fontWeight={"400 !important"}
                        >
                          {label}
                        </Checkbox>
                      ))}
                    </Stack>
                  </Flex>
                )}
              </CheckboxGroup>
            );
          }}
        />
        {errors.motif && <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
