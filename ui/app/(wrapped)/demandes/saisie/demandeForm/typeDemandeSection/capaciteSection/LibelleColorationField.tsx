import {AddIcon} from '@chakra-ui/icons';
import {Button, chakra, Flex,FormControl, FormErrorMessage, FormLabel, Input} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useFormContext} from 'react-hook-form';

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const LibelleColorationField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    watch,
    register,
    setValue,
  } = useFormContext<DemandeFormType>();

  const [coloration, libelleColoration2] = watch(["coloration", "libelleColoration2"]);
  const [hasDoubleLibelleColoration, setHasDoubleLibelleColoration] = useState<boolean>(!!libelleColoration2);

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "coloration") return;
        setValue("libelleColoration1", "");
        setValue("libelleColoration2", "");
      }).unsubscribe
  );

  return (
    <>
      {coloration && (
        <Flex direction={"row"} gap={2}>
          <Flex direction={"column"} flex={1} gap={2}>
            <FormControl className={className} isInvalid={!!errors.libelleColoration1}>
              <FormLabel>Complément du libellé formation</FormLabel>
              <Input
                {...register("libelleColoration1", {
                  disabled,
                  required: "Ce champ est obligatoire",
                })}
                placeholder="Complément du libellé formation"
              />
              {errors.libelleColoration1 && <FormErrorMessage>{errors.libelleColoration1?.message}</FormErrorMessage>}
            </FormControl>
            {hasDoubleLibelleColoration ? (
              <Flex direction={"column"} mt={2}>
                <FormControl className={className}>
                  <FormLabel>Deuxième complément de libellé formation</FormLabel>
                  <Input
                    {...register("libelleColoration2", {
                      disabled,
                    })}
                    placeholder="Deuxième complément de libellé formation"
                  />
                </FormControl>
              </Flex>
            ) : (
              <Button w={"fit-content"} mt={"auto"} leftIcon={<AddIcon />} onClick={() => setHasDoubleLibelleColoration(true)}>
                  Ajouter un autre libellé de coloration
              </Button>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
});
