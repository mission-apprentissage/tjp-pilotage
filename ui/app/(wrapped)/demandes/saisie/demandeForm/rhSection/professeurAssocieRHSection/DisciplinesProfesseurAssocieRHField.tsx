import { AddIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DisciplineAutocompleteInput } from "@/app/(wrapped)/demandes/saisie/components/DisciplineAutoComplete";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const DisciplinesProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      control,
    } = useFormContext<DemandeFormType>();

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
          <Flex direction={"row"} gap={2}>
            <Flex direction={"column"} shrink={1}>
              <FormLabel htmlFor="discipline-professeur-associe-autocomplete">Dans quelle(s) discipline(s) ?</FormLabel>
              <Controller
                name="discipline1ProfesseurAssocieRH"
                control={control}
                rules={{ required: "Ce champ est obligatoire" }}
                render={({ field: { onChange, value, name } }) => (
                  <DisciplineAutocompleteInput
                    id="discipline-professeur-associe-autocomplete"
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
            </Flex>

            {hasDoubleDiscipline ? (
              <Flex direction={"column"} flex={1}>
                <FormLabel htmlFor="discipline-professeur-associe-2-autocomplete">Discipline 2</FormLabel>
                <Controller
                  name="discipline2ProfesseurAssocieRH"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DisciplineAutocompleteInput
                      id="discipline-professeur-associe-2-autocomplete"
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
              </Flex>
            ) : (
              <Button w={56} mt={"auto"} leftIcon={<AddIcon />} onClick={() => setHasDoubleDiscipline(true)}>
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
  }
);
