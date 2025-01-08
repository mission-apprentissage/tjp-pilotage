import { AddIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DisciplineAutocompleteInput } from "@/app/(wrapped)/intentions/perdir/saisie/components/DisciplineAutoComplete";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const DisciplinesProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      control,
    } = useFormContext<IntentionForms>();

    const visible = watch("professeurAssocieRH");
    const discipline2ProfesseurAssocieRH = watch("discipline2ProfesseurAssocieRH");

    const [hasDoubleDiscipline, setHasDoubleDiscipline] = useState<boolean>(!!discipline2ProfesseurAssocieRH);
    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl
          className={className}
          isInvalid={!!errors.discipline1ProfesseurAssocieRH || !!errors.discipline2ProfesseurAssocieRH}
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          <Flex direction={"row"} gap={2}>
            <Controller
              name="discipline1ProfesseurAssocieRH"
              control={control}
              rules={{ required: "Ce champ est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <DisciplineAutocompleteInput
                  name={name}
                  active={!disabled}
                  inError={!!errors.discipline1ProfesseurAssocieRH}
                  defaultValue={{ label: value ?? "", value: value ?? "" }}
                  onChange={(v) => {
                    onChange(v?.value);
                  }}
                />
              )}
            />

            {hasDoubleDiscipline ? (
              <Controller
                name="discipline2ProfesseurAssocieRH"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DisciplineAutocompleteInput
                    name={name}
                    active={!disabled}
                    inError={!!errors.discipline2ProfesseurAssocieRH}
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
          {errors.discipline1ProfesseurAssocieRH && (
            <FormErrorMessage>{errors.discipline1ProfesseurAssocieRH.message}</FormErrorMessage>
          )}
          {errors.discipline2ProfesseurAssocieRH && (
            <FormErrorMessage>{errors.discipline2ProfesseurAssocieRH.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  },
);
