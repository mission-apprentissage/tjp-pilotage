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

export const DisciplinesReconversionRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms>();

    const visible = watch("reconversionRH");
    const discipline2ReconversionRH = watch("discipline2ReconversionRH");

    const [hasDoubleDiscipline, setDoubleDiscipline] = useState<boolean>(
      !!discipline2ReconversionRH
    );

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={
            !!errors.discipline1ReconversionRH ||
            !!errors.discipline2ReconversionRH
          }
        >
          <FormLabel>Dans quelle(s) discipline(s) ?</FormLabel>
          {visible && (
            <Flex direction="row" gap={2}>
              <Input
                w={56}
                {...register("discipline1ReconversionRH", {
                  shouldUnregister: true,
                  disabled: disabled,
                })}
              />
              {hasDoubleDiscipline ? (
                <Input
                  w={56}
                  disabled={disabled}
                  {...register("discipline2ReconversionRH", {
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
          {errors.discipline1ReconversionRH && (
            <FormErrorMessage>
              {errors.discipline1ReconversionRH.message}
            </FormErrorMessage>
          )}
          {errors.discipline2ReconversionRH && (
            <FormErrorMessage>
              {errors.discipline2ReconversionRH.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
