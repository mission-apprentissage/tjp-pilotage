import { chakra, Collapse, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

export const AutreMotifRefusField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<IntentionForms>();

  const motifRefus = watch("motifRefus");
  const visible = motifRefus?.includes("autre");

  useEffect(() => {
    if (!visible) {
      setValue("autreMotifRefus", undefined);
    }
  }, [visible, setValue]);

  return (
    <Collapse in={visible} unmountOnExit>
      <FormControl className={className} isInvalid={!!errors.autreMotifRefus} isRequired>
        <FormLabel>Autre motif de refus</FormLabel>
        {visible && (
          <Textarea
            {...register("autreMotifRefus", {
              disabled,
              required: "Veuillez préciser votre motif",
            })}
          />
        )}
        {errors.autreMotifRefus && <FormErrorMessage>{errors.autreMotifRefus.message}</FormErrorMessage>}
      </FormControl>
    </Collapse>
  );
});
