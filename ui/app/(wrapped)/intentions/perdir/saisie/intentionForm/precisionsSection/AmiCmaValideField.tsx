import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { toBoolean } from "@/utils/toBoolean";

export const AmiCmaValideField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
    watch,
    getValues,
    setValue,
  } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "amiCmaEnCoursValidation" && name !== "amiCma") return;
        if (name === "amiCma") setValue("amiCmaValide", undefined);
        if (name === "amiCmaEnCoursValidation" && getValues("amiCmaEnCoursValidation") === true)
          setValue("amiCmaValide", false);
      }).unsubscribe
  );

  const [typeDemande, amiCma] = watch(["typeDemande", "amiCma"]);
  const visible = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande) && amiCma;
  if (!visible) return null;

  return (
    <FormControl className={className} isInvalid={!!errors.amiCmaValide}>
      <FormLabel>Le financement est-il validé ?</FormLabel>
      <Controller
        name="amiCmaValide"
        control={control}
        rules={{
          validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, value, onBlur, ref } }) => (
          <RadioGroup
            ms={6}
            isDisabled={disabled}
            as={Stack}
            onBlur={onBlur}
            onChange={(v) => onChange(toBoolean(v))}
            value={JSON.stringify(value)}
          >
            <Radio ref={ref} value="true">
              Oui
            </Radio>
            <Radio ref={ref} value="false">
              Non
            </Radio>
          </RadioGroup>
        )}
      />
      {errors.amiCmaValide && <FormErrorMessage>{errors.amiCmaValide?.message}</FormErrorMessage>}
    </FormControl>
  );
});
