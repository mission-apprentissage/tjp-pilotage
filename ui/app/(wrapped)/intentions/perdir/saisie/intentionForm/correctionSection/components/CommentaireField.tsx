import { chakra, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/correctionSection/defaultFormValues";

export const CommentaireField = chakra(
  ({ disabled = false, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
    } = useFormContext<CorrectionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.commentaire}>
        <FormLabel>Commentaires / Observations sur la correction</FormLabel>
        <Textarea
          variant="grey"
          height={150}
          {...register("commentaire", { disabled })}
          placeholder="Merci de détailler les éléments de contexte de la correction"
        />
        {errors.commentaire && <FormErrorMessage>{errors.commentaire.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
