import {
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { TooltipIcon } from "../../../../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../../../../glossaire/glossaireContext";
import { toBoolean } from "../../../utils/toBoolean";
import { IntentionForms } from "../../defaultFormValues";

export const ProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();
    const { openGlossaire } = useGlossaireContext();

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.professeurAssocieRH}
        isRequired
      >
        <Flex direction={"row"}>
          <FormLabel>Un professeur associé ?</FormLabel>
          <TooltipIcon
            mt={"1"}
            ml={2}
            onClick={(e) => {
              e.preventDefault();
              openGlossaire("professeur-associe");
            }}
            color={"bluefrance.113"}
          />
        </Flex>
        <Controller
          name="professeurAssocieRH"
          control={control}
          disabled={disabled}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
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
        {errors.professeurAssocieRH && (
          <FormErrorMessage>
            {errors.professeurAssocieRH?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
