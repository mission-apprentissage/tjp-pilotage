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

export const DisciplinesRecrutementRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms>();

    const visible = watch("recrutementRH");
    const discipline2RecrutementRH = watch("discipline2RecrutementRH");

    const [hasDoubleDiscipline, setDoubleDiscipline] = useState<boolean>(
      !!discipline2RecrutementRH
    );

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={
            !!errors.discipline1RecrutementRH ||
            !!errors.discipline2RecrutementRH
          }
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          {visible && (
            <Flex direction="row" gap={2}>
              <Input
                w={56}
                {...register("discipline1RecrutementRH", {
                  shouldUnregister: true,
                  disabled: disabled,
                })}
              />
              {hasDoubleDiscipline ? (
                <Input
                  w={56}
                  disabled={disabled}
                  {...register("discipline2RecrutementRH", {
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
          {errors.discipline1RecrutementRH && (
            <FormErrorMessage>
              {errors.discipline1RecrutementRH.message}
            </FormErrorMessage>
          )}
          {errors.discipline2RecrutementRH && (
            <FormErrorMessage>
              {errors.discipline2RecrutementRH.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
