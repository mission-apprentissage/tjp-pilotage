import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

export const AutreMotif = chakra(({ className }: { className?: string }) => {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<IntentionForms[2]>();

  const [motif] = watch(["motif"]);

  const visible = motif?.includes("autre");

  return (
    <Collapse in={visible} unmountOnExit>
      <FormControl
        className={className}
        isInvalid={!!errors.autreMotif}
        isRequired
      >
        <FormLabel>Autre motif</FormLabel>
        {visible && (
          <Textarea
            {...register("autreMotif", {
              shouldUnregister: true,
              required: "Veuillez préciser votre motif",
            })}
          />
        )}
        {errors.autreMotif && (
          <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>
        )}
      </FormControl>
    </Collapse>
  );
});
