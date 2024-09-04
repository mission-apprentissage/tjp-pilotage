import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { CorrectionForms } from "../defaultFormValues";
import { Intention } from "../types";

export const LibelleColorationField = chakra(
  ({ demande, className }: { demande: Intention; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<CorrectionForms>();
    const coloration =
      demande.typeDemande != undefined &&
      (isTypeColoration(demande.typeDemande) || watch("coloration"));

    return (
      <>
        {coloration && (
          <FormControl
            className={className}
            isInvalid={!!errors.libelleColoration}
          >
            <FormLabel>Complément du libellé formation</FormLabel>
            <Input
              {...register("libelleColoration", {
                required: "Ce champ est obligatoire",
              })}
              placeholder="Complément du libellé formation"
            />
            {errors.libelleColoration && (
              <FormErrorMessage>
                {errors.libelleColoration?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
