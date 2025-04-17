import { chakra, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const LibelleColorationField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    watch,
    register,
    setValue,
  } = useFormContext<DemandeFormType>();

  const [coloration] = watch(["coloration"]);

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "coloration") return;
        setValue("libelleColoration", "");
      }).unsubscribe
  );

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
