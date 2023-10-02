import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

export const CommentaireField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.commentaire}>
        <FormLabel>Commentaires / Observations sur la demande</FormLabel>
        <Textarea
          height={150}
          {...register("commentaire", { shouldUnregister: true, disabled })}
        />
        {errors.commentaire && (
          <FormErrorMessage>{errors.commentaire.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
