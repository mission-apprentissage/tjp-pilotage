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

export const DisciplinesProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms>();

    const visible = watch("professeurAssocieRH");
    const discipline2ProfesseurAssocieRH = watch(
      "discipline2ProfesseurAssocieRH"
    );

    const [hasDoubleDiscipline, setDoubleDiscipline] = useState<boolean>(
      !!discipline2ProfesseurAssocieRH
    );

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={
            !!errors.discipline1ProfesseurAssocieRH ||
            !!errors.discipline2ProfesseurAssocieRH
          }
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          {visible && (
            <Flex direction="row" gap={2}>
              <Input
                w={56}
                {...register("discipline1ProfesseurAssocieRH", {
                  shouldUnregister: true,
                  disabled: disabled,
                })}
              />
              {hasDoubleDiscipline ? (
                <Input
                  w={56}
                  disabled={disabled}
                  {...register("discipline2ProfesseurAssocieRH", {
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
          {errors.discipline1ProfesseurAssocieRH && (
            <FormErrorMessage>
              {errors.discipline1ProfesseurAssocieRH.message}
            </FormErrorMessage>
          )}
          {errors.discipline2ProfesseurAssocieRH && (
            <FormErrorMessage>
              {errors.discipline2ProfesseurAssocieRH.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
