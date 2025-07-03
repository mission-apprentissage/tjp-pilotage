import { chakra, Collapse, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { getMotifsTriggerAutre } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";

export const AutreMotifField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<DemandeFormType>();

  const motif = watch("motif");
  const visible = getMotifsTriggerAutre().some((m) => motif?.includes(m));

  useEffect(() => {
    if (!visible) {
      setValue("autreMotif", undefined);
    }
  }, [visible, setValue]);

  return (
    <Collapse in={visible} unmountOnExit>
      <FormControl className={className} isInvalid={!!errors.autreMotif} isRequired>
        <FormLabel>Autre motif ou précision</FormLabel>
        {visible && (
          <Textarea
            {...register("autreMotif", {
              required: "Veuillez préciser votre motif",
            })}
            isDisabled={disabled}
          />
        )}
        {errors.autreMotif && <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>}
      </FormControl>
    </Collapse>
  );
});
