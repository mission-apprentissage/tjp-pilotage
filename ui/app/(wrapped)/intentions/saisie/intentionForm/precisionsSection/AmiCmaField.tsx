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

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { TooltipIcon } from "@/components/TooltipIcon";
import { toBoolean } from "@/utils/toBoolean";

export const AmiCmaField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const { openGlossaire } = useGlossaireContext();
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl as="fieldset" className={className} isInvalid={!!errors.amiCma} isRequired>
      <Flex direction={"row"}>
        <FormLabel as="legend">AMI / CMA</FormLabel>
        <TooltipIcon
          mt={"1"}
          label={
            <Box w={"fit-content"}>
              <Text>Appel à Manifestation d'Intérêt « Compétences et métiers d’avenir »</Text>
              <Text mt={2}>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("ami-cma")}
          color={"bluefrance.113"}
        />
      </Flex>
      <Controller
        name="amiCma"
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
      {errors.amiCma && <FormErrorMessage>{errors.amiCma?.message}</FormErrorMessage>}
    </FormControl>
  );
});
