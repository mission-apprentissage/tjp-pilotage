import {
  chakra,
  Checkbox,
  CheckboxGroup,
  Collapse,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import {
  getMotifsRefusTypeDemande,
  MotifRefusLabel,
  MOTIFS_REFUS_LABELS,
} from "@/app/(wrapped)/utils/motifRefusDemandeUtils";
import { TypeDemande } from "@/app/(wrapped)/utils/typeDemandeUtils";

export const MotifRefusBlock = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      control,
      watch,
      formState: { errors },
      setValue,
    } = useFormContext<IntentionForms>();

    const status = watch("status");
    const visible = status === "refused";

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "status") return;
          setValue("motifRefus", []);
          setValue("autreMotifRefus", "");
        }).unsubscribe
    );

    const getMotifOptions = (typeDemande: TypeDemande) => {
      return Object.entries(MOTIFS_REFUS_LABELS)
        .filter(
          ([key]) =>
            getMotifsRefusTypeDemande(typeDemande)?.includes(
              key as MotifRefusLabel
            )
        )
        .map(([value, label]) => ({
          value,
          label,
        }));
    };

    const [typeDemande] = watch(["typeDemande"]);
    if (!typeDemande) return <></>;

    return (
      <Collapse in={visible} unmountOnExit className={className}>
        <FormLabel mb={2}>
          Merci de préciser le(s) motif(s) de votre refus :
        </FormLabel>
        <Controller
          name="motifRefus"
          shouldUnregister
          disabled={disabled}
          control={control}
          rules={{ required: "Le motif de refus est obligatoire" }}
          render={({
            field: { onChange, value, onBlur, ref, name, disabled },
          }) => {
            return (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]}>
                  {getMotifOptions(typeDemande).map(({ value, label }) => (
                    <Checkbox
                      ref={ref}
                      disabled={disabled}
                      name={name}
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
            );
          }}
        />
        {errors.motifRefus && (
          <FormErrorMessage>{errors.motifRefus?.message}</FormErrorMessage>
        )}
      </Collapse>
    );
  }
);
