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

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { toBoolean } from "@/utils/toBoolean";

export const ProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.professeurAssocieRH} isRequired>
        <Flex direction={"row"}>
          <FormLabel>Un professeur associé ?</FormLabel>
          <GlossaireShortcut
            glossaireEntryKey={"professeur-associe"}
            color="bluefrance.113"
            mb={"6px"}
            tooltip={
              <Box>
                <Text>
                  Dans le cas d’enseignements assurés par un salarié du secteur privé expert dans son domaine.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
          />
        </Flex>
        <Controller
          name="professeurAssocieRH"
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
        {errors.professeurAssocieRH && <FormErrorMessage>{errors.professeurAssocieRH?.message}</FormErrorMessage>}
      </FormControl>
    );
  },
);
