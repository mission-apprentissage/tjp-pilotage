import {
  Alert,
  AlertDescription,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { toDate } from "date-fns";
import {useContext,useEffect} from 'react';
import { useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { z } from "zod";

import { client } from "@/api.client";
import {PreviousCampagneContext} from '@/app/previousCampagneContext';
import {getErrorMessage} from '@/utils/apiError';
import { getDatePickerConfig } from "@/utils/getDatePickerConfig";
import {useCurrentCampagne} from '@/utils/security/useCurrentCampagne';

export const CreateCampagne = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const toast = useToast();
  const {
    getValues,
    setValue,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<(typeof client.inferArgs)["[POST]/campagnes/:campagneId"]["body"]>({
    shouldUseNativeValidation: false,
  });

  useEffect(() => reset(undefined, { keepDefaultValues: true }), [isOpen, reset]);

  const queryClient = useQueryClient();

  const { setCampagne: setCurrentCampagne } = useCurrentCampagne();
  const { setCampagne: setPreviousCampagne } = useContext(PreviousCampagneContext);

  const {
    mutate: createCampagne,
    isLoading,
    isError,
    error,
  } = client.ref("[POST]/campagnes/:campagneId").useMutation({
    onSuccess: async () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La campagne a bien été créée",
      });
      queryClient.invalidateQueries(["[GET]/campagnes"]);
      await client.ref("[GET]/campagne/current").query({}).then((campagne) => {
        setCurrentCampagne(campagne.current);
        setPreviousCampagne(campagne.previous);
      });
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit((form) =>
          createCampagne({
            body: {
              ...form,
              dateDebut: toDate(form.dateDebut).toISOString(),
              dateFin: toDate(form.dateFin).toISOString(),
            },
          })
        )}
      >
        <ModalHeader>Créer une campagne</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.annee} isRequired>
            <FormLabel>Année</FormLabel>
            <NumberInput
              onFocus={(e) => e.currentTarget.select()}
            >
              <NumberInputField
                {...register("annee", {
                  validate: (annee) =>
                    z.coerce
                      .string()
                      .regex(/^\d{4}$/)
                      .safeParse(annee).success ?? "Veuillez saisir une année valide",
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {!!errors.annee && <FormErrorMessage>{errors.annee.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.statut} isRequired>
            <FormLabel>Statut</FormLabel>
            <Select
              width={[null, null, "72"]}
              {...register("statut", {
                required: "Veuillez saisir un statut",
              })}
            >
              {Object.keys(CampagneStatutEnum).map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </Select>
            {!!errors.statut && <FormErrorMessage>{errors.statut.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.dateDebut} isRequired>
            <FormLabel htmlFor="input-date-debut">Date début</FormLabel>
            <SingleDatepicker
              date={getValues("dateDebut") ? toDate(getValues("dateDebut")) : undefined}
              onDateChange={(date) => {
                setValue("dateDebut", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              configs={getDatePickerConfig()}
              propsConfigs={{
                inputProps: {
                  id: "input-date-debut",
                },
                triggerBtnProps: {
                  width: [null, null, "72"],
                  fontSize: 14,
                  fontWeight: 400,
                  justifyContent: "start"
                },
              }}
            />
            {!!errors.dateDebut && <FormErrorMessage>{errors.dateDebut.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.dateFin} isRequired>
            <FormLabel htmlFor="input-date-fin">Date de fin</FormLabel>
            <SingleDatepicker
              date={getValues("dateFin") ? toDate(getValues("dateFin")) : undefined}
              onDateChange={(date) => {
                setValue("dateFin", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              configs={getDatePickerConfig()}
              propsConfigs={{
                inputProps: {
                  id: "input-date-fin",
                },
                triggerBtnProps: {
                  width: [null, null, "72"],
                  fontSize: 14,
                  fontWeight: 400,
                  justifyContent: "start"
                },
              }}
            />
            {!!errors.dateFin && <FormErrorMessage>{errors.dateFin.message}</FormErrorMessage>}
          </FormControl>
          {isError && (
            <Alert status="error">
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="primary" ml={3} isLoading={isLoading} type="submit">
            Envoyer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
