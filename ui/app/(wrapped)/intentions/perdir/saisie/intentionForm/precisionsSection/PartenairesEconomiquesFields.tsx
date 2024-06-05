import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import { isTypeFermeture } from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";

export const PartenairesEconomiquesFields = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms>();

    const [
      typeDemande,
      partenairesEconomiquesImpliques,
      partenaireEconomique2,
    ] = watch([
      "typeDemande",
      "partenairesEconomiquesImpliques",
      "partenaireEconomique2",
    ]);

    const visible =
      partenairesEconomiquesImpliques &&
      !isTypeFermeture(typeDemande) &&
      !isTypeDiminution(typeDemande);

    if (!visible) return null;

    const [hasDoublePartenaire, setHasDoublePartenaire] = useState<boolean>(
      !!partenaireEconomique2
    );
    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl
          className={className}
          isInvalid={
            !!errors.partenaireEconomique1 || !!errors.partenaireEconomique2
          }
        >
          <Flex direction={"row"} gap={2}>
            <Flex direction={"column"}>
              <FormLabel>Partenaire n°1</FormLabel>
              <Input
                w="xs"
                bgColor={"white"}
                border={"1px solid"}
                required
                {...register("partenaireEconomique1", {
                  shouldUnregister: true,
                  disabled: disabled,
                })}
              />
            </Flex>
            {hasDoublePartenaire ? (
              <Flex direction={"column"}>
                <FormLabel>Partenaire n°2</FormLabel>
                <Input
                  w="xs"
                  bgColor={"white"}
                  border={"1px solid"}
                  {...register("partenaireEconomique2", {
                    shouldUnregister: true,
                    disabled: disabled,
                  })}
                />
              </Flex>
            ) : (
              <Button
                w={56}
                leftIcon={<AddIcon />}
                onClick={() => setHasDoublePartenaire(true)}
                mt={"auto"}
              >
                Ajouter un partenaire
              </Button>
            )}
          </Flex>
          {errors.partenaireEconomique1 && (
            <FormErrorMessage>
              {errors.partenaireEconomique1.message}
            </FormErrorMessage>
          )}
          {errors.partenaireEconomique2 && (
            <FormErrorMessage>
              {errors.partenaireEconomique2.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  }
);
