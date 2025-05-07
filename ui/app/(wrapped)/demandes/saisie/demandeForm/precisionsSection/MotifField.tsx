import {
  chakra,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Highlight,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import {
  isTypeAjustement,
  isTypeColoration,
  isTypeFermeture
} from "shared/utils/typeDemandeUtils";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import type { AnneeCampagneMotifDemande, MotifDemandeLabel } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";
import { getMotifsTypeDemande, MOTIFS_DEMANDE_LABEL } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";

const getMotifOptions = (typeDemande: TypeDemandeType, anneeCampagne: string) => {
  return Object.entries(MOTIFS_DEMANDE_LABEL[anneeCampagne as AnneeCampagneMotifDemande])
    .filter(([key]) => getMotifsTypeDemande(typeDemande)?.includes(key as MotifDemandeLabel))
    .map(([value, label]) => ({
      value,
      label,
    }));
};

export const MotifField = chakra(
  ({ disabled, className, campagne }: { disabled?: boolean; className?: string; campagne: CampagneType }) => {
    const {
      formState: { errors },
      control,
      watch,
      setValue,
    } = useFormContext<DemandeFormType>();

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
      <FormControl as="fieldset" className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel as="legend">
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
                    <Text mb={2} fontWeight={700}>
                      <Highlight query={"*"} styles={{ color: "red" }}>
                        Merci de préciser le(s) motif(s) de votre coloration *
                      </Highlight>
                    </Text>
                    <Stack spacing={[3]} ms={6}>
                      {getMotifOptions("coloration", campagne.annee)?.map(({ value, label }) => (
                        <Checkbox
                          ref={ref}
                          disabled={disabled}
                          name={name}
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
