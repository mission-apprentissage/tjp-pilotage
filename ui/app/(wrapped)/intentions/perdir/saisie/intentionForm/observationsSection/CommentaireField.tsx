import { chakra, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const CommentaireField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl className={className} isInvalid={!!errors.commentaire}>
      <FormLabel>Commentaires / Observations sur la demande</FormLabel>
      <Textarea
        variant="grey"
        height={150}
        {...register("commentaire", { disabled })}
        placeholder="Merci de détailler les éléments de contexte du projet : développement économique ou démographique du territoire, prospectives étayées, partenariats noués, typologie d’élèves accueillis…"
      />
      {errors.commentaire && <FormErrorMessage>{errors.commentaire.message}</FormErrorMessage>}
    </FormControl>
  );
});
