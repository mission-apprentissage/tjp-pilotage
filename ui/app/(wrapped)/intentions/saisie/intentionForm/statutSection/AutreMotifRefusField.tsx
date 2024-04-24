import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

export const AutreMotifRefusField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const [motif] = watch(["motifRefus"]);

    const visible = motif?.includes("autre");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={!!errors.autreMotifRefus}
          isRequired
        >
          <FormLabel>Autre motif de refus</FormLabel>
          {visible && (
            <Textarea
              {...register("autreMotifRefus", {
                shouldUnregister: true,
                disabled,
                required: "Veuillez préciser votre motif",
              })}
            />
          )}
          {errors.autreMotifRefus && (
            <FormErrorMessage>
              {errors.autreMotifRefus.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
