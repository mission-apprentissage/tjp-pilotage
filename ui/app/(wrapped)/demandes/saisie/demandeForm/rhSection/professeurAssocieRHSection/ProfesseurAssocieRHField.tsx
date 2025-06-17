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

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { toBoolean } from "@/utils/toBoolean";

export const ProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<DemandeFormType>();

    return (
      <FormControl as="fieldset" className={className} isInvalid={!!errors.professeurAssocieRH} isRequired>
        <Flex direction={"row"}>
          <FormLabel as="legend">Un professeur associé ?</FormLabel>
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
          rules={{
            validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref } }) => (
            <RadioGroup
              ms={6}
              as={Stack}
              onBlur={onBlur}
              onChange={(v) => onChange(toBoolean(v))}
              value={JSON.stringify(value)}
            >
              <Radio
                ref={ref}
                value="true"
                isReadOnly={disabled}
                isDisabled={disabled}
              >
                Oui
              </Radio>
              <Radio
                ref={ref}
                value="false"
                isReadOnly={disabled}
                isDisabled={disabled}
              >
                Non
              </Radio>
            </RadioGroup>
          )}
        />
        {errors.professeurAssocieRH && <FormErrorMessage>{errors.professeurAssocieRH?.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
