import {
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
import { isTypeDiminution, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";
import { toBoolean } from "@/utils/toBoolean";

export const CmqImpliqueField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const { openGlossaire } = useGlossaireContext();
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<DemandeFormType>();

  const typeDemande = watch("typeDemande");

  const visible = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);
  if (!visible) return null;

  return (
    <FormControl as="fieldset" className={className} isInvalid={!!errors.cmqImplique} isRequired>
      <Flex direction={"row"}>
        <FormLabel as="legend">Un CMQ est-il impliqué ?</FormLabel>
        <TooltipIcon
          mt={"1"}
          label={
            <Flex direction="column" gap={2}>
              <Text>Campus des Métiers et des Qualifications</Text>
              <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
            </Flex>
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
