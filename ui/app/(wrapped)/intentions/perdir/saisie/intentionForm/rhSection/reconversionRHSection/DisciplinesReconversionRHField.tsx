import { AddIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DisciplineAutocompleteInput } from "@/app/(wrapped)/intentions/perdir/saisie/components/DisciplineAutoComplete";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const DisciplinesReconversionRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      control,
    } = useFormContext<IntentionForms>();

    const visible = watch("reconversionRH");
    const discipline2ReconversionRH = watch("discipline2ReconversionRH");

    const [hasDoubleDiscipline, setHasDoubleDiscipline] = useState<boolean>(!!discipline2ReconversionRH);
    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl
          className={className}
          isInvalid={!!errors.discipline1ReconversionRH || !!errors.discipline2ReconversionRH}
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          <Flex direction={"row"} gap={2}>
            <Controller
              name="discipline1ReconversionRH"
              control={control}
              rules={{ required: "Ce champ est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <DisciplineAutocompleteInput
                  name={name}
                  active={!disabled}
                  inError={!!errors.discipline1ReconversionRH}
                  defaultValue={{ label: value ?? "", value: value ?? "" }}
                  onChange={(v) => {
                    onChange(v?.value);
                  }}
                />
              )}
            />

            {hasDoubleDiscipline ? (
              <Controller
                name="discipline2ReconversionRH"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DisciplineAutocompleteInput
                    name={name}
                    active={!disabled}
                    inError={!!errors.discipline2ReconversionRH}
                    defaultValue={{ label: value ?? "", value: value ?? "" }}
                    onChange={(v) => {
                      onChange(v?.value);
                    }}
                  />
                )}
              />
            ) : (
              <Button w={56} leftIcon={<AddIcon />} onClick={() => setHasDoubleDiscipline(true)}>
                Ajouter une discipline
              </Button>
            )}
          </Flex>
          {errors.discipline1ReconversionRH && (
            <FormErrorMessage>{errors.discipline1ReconversionRH.message}</FormErrorMessage>
          )}
          {errors.discipline2ReconversionRH && (
            <FormErrorMessage>{errors.discipline2ReconversionRH.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  },
);
