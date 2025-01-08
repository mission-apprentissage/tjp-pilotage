import { chakra, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

export const LibelleColorationField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    watch,
    register,
    setValue,
  } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "coloration") return;
        setValue("libelleColoration", undefined);
      }).unsubscribe,
  );

  const [coloration] = watch(["coloration"]);

  return (
    <>
      {coloration && (
        <FormControl className={className} isInvalid={!!errors.libelleColoration}>
          <FormLabel>Complément du libellé formation</FormLabel>
          <Input
            {...register("libelleColoration", {
              disabled,
              required: "Ce champ est obligatoire",
            })}
            placeholder="Complément du libellé formation"
          />
          {errors.libelleColoration && <FormErrorMessage>{errors.libelleColoration?.message}</FormErrorMessage>}
        </FormControl>
      )}
    </>
  );
});
