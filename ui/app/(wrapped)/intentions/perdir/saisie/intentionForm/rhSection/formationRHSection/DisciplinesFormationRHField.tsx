import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DisciplineAutocompleteInput } from "../../../components/DisciplineAutoComplete";
import { IntentionForms } from "../../defaultFormValues";

export const DisciplinesFormationRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      control,
    } = useFormContext<IntentionForms>();

    const visible = watch("formationRH");
    const discipline2FormationRH = watch("discipline2FormationRH");

    const [hasDoubleDiscipline, setHasDoubleDiscipline] = useState<boolean>(
      !!discipline2FormationRH
    );
    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl
          className={className}
          isInvalid={
            !!errors.discipline1FormationRH || !!errors.discipline2FormationRH
          }
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          <Flex direction={"row"} gap={2}>
            <Controller
              name="discipline1FormationRH"
              control={control}
              rules={{ required: "Ce champ est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <DisciplineAutocompleteInput
                  name={name}
                  active={!disabled}
                  inError={!!errors.discipline1FormationRH}
                  defaultValue={{ label: value, value: value ?? "" }}
                  onChange={(v) => {
                    onChange(v?.value);
                  }}
                />
              )}
            />

            {hasDoubleDiscipline ? (
              <Controller
                name="discipline2FormationRH"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DisciplineAutocompleteInput
                    name={name}
                    active={!disabled}
                    inError={!!errors.discipline2FormationRH}
                    defaultValue={{ label: value, value: value ?? "" }}
                    onChange={(v) => {
                      onChange(v?.value);
                    }}
                  />
                )}
              />
            ) : (
              <Button
                w={56}
                leftIcon={<AddIcon />}
                onClick={() => setHasDoubleDiscipline(true)}
              >
                Ajouter une discipline
              </Button>
            )}
          </Flex>
          {errors.discipline1FormationRH && (
            <FormErrorMessage>
              {errors.discipline1FormationRH.message}
            </FormErrorMessage>
          )}
          {errors.discipline2FormationRH && (
            <FormErrorMessage>
              {errors.discipline2FormationRH.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  }
);