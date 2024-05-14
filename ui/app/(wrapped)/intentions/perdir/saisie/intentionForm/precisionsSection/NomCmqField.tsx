import {
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { CampusAutocompleteInput } from "../../components/CampusAutoComplete";
import { IntentionForms } from "../defaultFormValues";

export const NomCmqField = chakra(
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
        <FormControl className={className} isInvalid={!!errors.nomCmq}>
          <FormLabel>Précisez le campus</FormLabel>
          <Flex direction={"row"} gap={2}>
            <Controller
              name="nomCmq"
              control={control}
              rules={{ required: "Ce champ est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <CampusAutocompleteInput
                  name={name}
                  active={!disabled}
                  inError={!!errors.nomCmq}
                  defaultValue={{ label: value, value: value ?? "" }}
                  onChange={(v) => {
                    onChange(v?.value);
                  }}
                />
              )}
            />
          </Flex>
          {errors.nomCmq && (
            <FormErrorMessage>{errors.nomCmq.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  }
);
