import { chakra, Collapse, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/correctionSection/defaultFormValues";
import { getMotifsTriggerAutre } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";

export const AutreMotifField = chakra(({ disabled = false, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<CorrectionForms>();

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
              disabled,
              required: "Veuillez préciser votre motif",
            })}
          />
        )}
        {errors.autreMotif && <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>}
      </FormControl>
    </Collapse>
  );
});
