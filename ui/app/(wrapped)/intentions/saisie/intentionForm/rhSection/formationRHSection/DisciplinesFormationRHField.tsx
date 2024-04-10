import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../../defaultFormValues";

export const DisciplinesFormationRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms>();

    const visible = watch("formationRH");
    const discipline2FormationRH = watch("discipline2FormationRH");

    const [hasDoubleDiscipline, setDoubleDiscipline] = useState<boolean>(
      !!discipline2FormationRH
    );

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={
            !!errors.discipline1FormationRH || !!errors.discipline2FormationRH
          }
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          {visible && (
            <Flex direction="row" gap={2}>
              <Input
                w={56}
                {...register("discipline1FormationRH", {
                  shouldUnregister: true,
                  disabled: disabled,
                })}
              />
              {hasDoubleDiscipline ? (
                <Input
                  w={56}
                  disabled={disabled}
                  {...register("discipline2FormationRH", {
                    shouldUnregister: true,
                    disabled: disabled,
                  })}
                />
              ) : (
                <Button
                  w={56}
                  leftIcon={<AddIcon />}
                  onClick={() => setDoubleDiscipline(true)}
                >
                  Ajouter une discipline
                </Button>
              )}
            </Flex>
          )}
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
      </Collapse>
    );
  }
);
