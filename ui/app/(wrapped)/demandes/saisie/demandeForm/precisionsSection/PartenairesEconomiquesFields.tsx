import { AddIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeDiminution, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const PartenairesEconomiquesFields = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
      setValue,
    } = useFormContext<DemandeFormType>();

    const [typeDemande, partenairesEconomiquesImpliques, partenaireEconomique2] = watch([
      "typeDemande",
      "partenairesEconomiquesImpliques",
      "partenaireEconomique2",
    ]);

    const visible = partenairesEconomiquesImpliques && !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

    const [hasDoublePartenaire, setHasDoublePartenaire] = useState<boolean>(!!partenaireEconomique2);

    useEffect(() => {
      if (!visible) {
        setValue("partenaireEconomique1", undefined);
        setValue("partenaireEconomique2", undefined);
      }
    }, [visible, setValue]);

    useEffect(() => {
      if (!hasDoublePartenaire) {
        setValue("partenaireEconomique2", undefined);
      }
    }, [hasDoublePartenaire, setValue]);

    if (!visible) return null;

    return (
      <Flex flex={1}>
        <FormControl className={className} isInvalid={!!errors.partenaireEconomique1 || !!errors.partenaireEconomique2}>
          <Flex direction={"row"} gap={2}>
            <Flex direction={"column"}>
              <FormLabel>Partenaire n°1</FormLabel>
              <Input
                w="xs"
                bgColor={"white"}
                border={"1px solid"}
                required
                {...register("partenaireEconomique1", {
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
                    disabled: disabled,
                  })}
                />
              </Flex>
            ) : (
              <Button w={56} leftIcon={<AddIcon />} onClick={() => setHasDoublePartenaire(true)} mt={"auto"}>
                Ajouter un partenaire
              </Button>
            )}
          </Flex>
          {errors.partenaireEconomique1 && <FormErrorMessage>{errors.partenaireEconomique1.message}</FormErrorMessage>}
          {errors.partenaireEconomique2 && <FormErrorMessage>{errors.partenaireEconomique2.message}</FormErrorMessage>}
        </FormControl>
      </Flex>
    );
  }
);
