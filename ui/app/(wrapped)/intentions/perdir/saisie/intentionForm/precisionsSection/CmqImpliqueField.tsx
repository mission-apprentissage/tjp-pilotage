import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { TooltipIcon } from "@/components/TooltipIcon";
import { toBoolean } from "@/utils/toBoolean";

export const CmqImpliqueField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const { openGlossaire } = useGlossaireContext();
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<IntentionForms>();

  const typeDemande = watch("typeDemande");

  const visible = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);
  if (!visible) return null;

  return (
    <FormControl className={className} isInvalid={!!errors.cmqImplique} isRequired>
      <Flex direction={"row"}>
        <FormLabel>Un CMQ est-il impliqué ?</FormLabel>
        <TooltipIcon
          mt={"1"}
          label={
            <Box w={"fit-content"}>
              <Text>Campus des Métiers et des Qualifications</Text>
              <Text mt={2}>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("cmq")}
          color={"bluefrance.113"}
        />
      </Flex>
      <Controller
        name="cmqImplique"
        control={control}
        disabled={disabled}
        rules={{
          validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, value, onBlur, ref, disabled } }) => (
          <RadioGroup
            ms={6}
            isDisabled={disabled}
            as={Stack}
            onBlur={onBlur}
            onChange={(v) => onChange(toBoolean(v))}
            value={JSON.stringify(value)}
          >
            <Radio ref={ref} value="true">
              Oui
            </Radio>
            <Radio ref={ref} value="false">
              Non
            </Radio>
          </RadioGroup>
        )}
      />
      {errors.cmqImplique && <FormErrorMessage>{errors.cmqImplique?.message}</FormErrorMessage>}
    </FormControl>
  );
});
