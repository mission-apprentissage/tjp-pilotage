import { AddIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DisciplineAutocompleteInput } from "@/app/(wrapped)/demandes/saisie/components/DisciplineAutoComplete";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const DisciplinesRecrutementRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      control,
    } = useFormContext<DemandeFormType>();

    const visible = watch("recrutementRH");
    const discipline2RecrutementRH = watch("discipline2RecrutementRH");

    const [hasDoubleDiscipline, setHasDoubleDiscipline] = useState<boolean>(!!discipline2RecrutementRH);
    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl
          className={className}
          isInvalid={!!errors.discipline1RecrutementRH || !!errors.discipline2RecrutementRH}
        >
          <Flex direction={"row"} gap={2}>
            <Flex direction={"column"} shrink={1}>
              <FormLabel htmlFor="discipline-recrutement-autocomplete">Dans quelle(s) discipline(s) ?</FormLabel>
              <Controller
                name="discipline1RecrutementRH"
                control={control}
                rules={{ required: "Ce champ est obligatoire" }}
                render={({ field: { onChange, value, name } }) => (
                  <DisciplineAutocompleteInput
                    id="discipline-recrutement-autocomplete"
                    name={name}
                    active={!disabled}
                    inError={!!errors.discipline1RecrutementRH}
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
                <FormLabel htmlFor="discipline-recrutement-2-autocomplete">Discipline 2</FormLabel>
                <Controller
                  name="discipline2RecrutementRH"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DisciplineAutocompleteInput
                      id={"discipline-recrutement-2-autocomplete"}
                      name={name}
                      active={!disabled}
                      inError={!!errors.discipline2RecrutementRH}
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
          {errors.discipline1RecrutementRH && (
            <FormErrorMessage>{errors.discipline1RecrutementRH.message}</FormErrorMessage>
          )}
          {errors.discipline2RecrutementRH && (
            <FormErrorMessage>{errors.discipline2RecrutementRH.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  }
);
