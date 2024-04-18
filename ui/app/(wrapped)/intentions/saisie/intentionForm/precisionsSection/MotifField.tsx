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
import { isTypeColoration } from "shared/demandeValidators/validators";

import {
  getMotifsTypeDemande,
  MotifLabel,
  MOTIFS_LABELS,
} from "../../../utils/motifDemandeUtils";
import {
  getTypeDemandeLabel,
  isTypeFermeture,
  TypeDemande,
} from "../../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";

const getMotifOptions = (typeDemande: TypeDemande) => {
  return Object.entries(MOTIFS_LABELS)
    .filter(
      ([key]) => getMotifsTypeDemande(typeDemande)?.includes(key as MotifLabel)
    )
    .map(([value, label]) => ({
      value,
      label,
    }));
};

export const MotifField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
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
    if (!typeDemande) return <></>;

    return (
      <FormControl className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel>
          Merci de préciser le(s) motif(s) de votre{" "}
          {getTypeDemandeLabel(typeDemande).toLowerCase()}
        </FormLabel>
        <Controller
          name="motif"
          shouldUnregister
          disabled={disabled}
          control={control}
          rules={{ required: "Le motif est obligatoire" }}
          render={({
            field: { onChange, value, onBlur, ref, name, disabled },
          }) => {
            return (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]} ms={6}>
                  {getMotifOptions(typeDemande)?.map(({ value, label }) => (
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
                {coloration &&
                  !isTypeColoration(typeDemande) &&
                  !isTypeFermeture(typeDemande) && (
                    <Flex direction={"column"} mt={8}>
                      <FormLabel>
                        Merci de préciser le(s) motif(s) de votre coloration
                      </FormLabel>
                      <Stack spacing={[3]} ms={6}>
                        {getMotifOptions("coloration")?.map(
                          ({ value, label }) => (
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
                          )
                        )}
                      </Stack>
                    </Flex>
                  )}
              </CheckboxGroup>
            );
          }}
        />
        {errors.motif && (
          <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
