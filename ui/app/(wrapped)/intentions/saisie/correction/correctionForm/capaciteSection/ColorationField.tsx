import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Intention } from "@/app/(wrapped)/intentions/corrections/[numero]/correctionForm/types";
import { toBoolean } from "@/utils/toBoolean";

import { TooltipIcon } from "../../../../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../../../../glossaire/glossaireContext";
import { isTypeColoration } from "../../../../utils/typeDemandeUtils";
import { CorrectionForms } from "../defaultFormValues";

export const ColorationField = chakra(
  ({ demande, className }: { demande: Intention; className?: string }) => {
    const {
      formState: { errors },
      control,
      setValue,
    } = useFormContext<CorrectionForms>();
    const { openGlossaire } = useGlossaireContext();

    useEffect(() => {
      setValue("coloration", demande?.coloration ?? false);
    }, [demande]);

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.coloration}
        isRequired
      >
        <FormLabel>
          Coloration
          <TooltipIcon
            mt={"1"}
            ml={2}
            onClick={(e) => {
              e.preventDefault();
              openGlossaire("coloration");
            }}
            color={"bluefrance.113"}
          />
        </FormLabel>
        <Controller
          name="coloration"
          control={control}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({ field: { onChange, ref, name, onBlur, value } }) => (
            <RadioGroup
              ms={6}
              as={Stack}
              name={name}
              onBlur={onBlur}
              onChange={(v) => onChange(toBoolean(v))}
              value={JSON.stringify(value)}
            >
              <Radio
                ref={ref}
                value="true"
                isReadOnly={
                  demande.typeDemande != undefined &&
                  isTypeColoration(demande.typeDemande)
                }
                _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                Oui
              </Radio>
              <Radio
                ref={ref}
                value="false"
                isReadOnly={
                  demande.typeDemande != undefined &&
                  isTypeColoration(demande.typeDemande)
                }
                _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                Non
              </Radio>
            </RadioGroup>
          )}
        />
        {errors.coloration && (
          <FormErrorMessage>{errors.coloration.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
