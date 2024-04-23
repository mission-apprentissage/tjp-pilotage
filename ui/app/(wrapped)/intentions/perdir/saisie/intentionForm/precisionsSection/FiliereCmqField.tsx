import {
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { DisciplineAutocompleteInput } from "../../components/DisciplineAutoComplete";
import { IntentionForms } from "../defaultFormValues";

export const FiliereCmqField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      control,
    } = useFormContext<IntentionForms>();

    const visible = watch("cmqImplique");
    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl
          className={className}
          isInvalid={!!errors.filiereCmq || !!errors.discipline2FormationRH}
        >
          <FormLabel>Précisez la filière d'activité du campus ?</FormLabel>
          <Flex direction={"row"} gap={2}>
            <Controller
              name="filiereCmq"
              control={control}
              rules={{ required: "Ce champ est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <DisciplineAutocompleteInput
                  name={name}
                  active={!disabled}
                  inError={!!errors.filiereCmq}
                  defaultValue={{ label: value, value: value ?? "" }}
                  onChange={(v) => {
                    onChange(v?.value);
                  }}
                />
              )}
            />
          </Flex>
          {errors.filiereCmq && (
            <FormErrorMessage>{errors.filiereCmq.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  }
);
