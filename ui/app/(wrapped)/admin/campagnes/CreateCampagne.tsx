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
  UnorderedList,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { toDate } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import { z } from "zod";

import { client } from "@/api.client";
import { getDatePickerConfig } from "@/utils/getDatePickerConfig";

export const CreateCampagne = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    getValues,
    setValue,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<
    (typeof client.inferArgs)["[POST]/campagnes/:campagneId"]["body"]
  >({
    shouldUseNativeValidation: false,
  });

  useEffect(
    () => reset(undefined, { keepDefaultValues: true }),
    [isOpen, reset]
  );

  const queryClient = useQueryClient();

  const [serverErrors, setServerErrors] = useState<Record<string, string>>();

  const {
    mutate: createCampagne,
    isLoading,
    isError,
  } = client.ref("[POST]/campagnes/:campagneId").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/campagnes"]);
      onClose();
    },
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setServerErrors(errors);
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
              defaultValue={parseInt(CURRENT_ANNEE_CAMPAGNE)}
              min={parseInt(CURRENT_ANNEE_CAMPAGNE)}
              onFocus={(e) => e.currentTarget.select()}
            >
              <NumberInputField
                {...register("annee", {
                  validate: (annee) =>
                    z.coerce
                      .string()
                      .regex(/^\d{4}$/)
                      .safeParse(annee).success ||
                    "Veuillez saisir une année valide",
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {!!errors.annee && (
              <FormErrorMessage>{errors.annee.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.statut} isRequired>
            <FormLabel>Statut</FormLabel>
            <Select
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
            {!!errors.statut && (
              <FormErrorMessage>{errors.statut.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.dateDebut} isRequired>
            <FormLabel>Date début</FormLabel>
            <SingleDatepicker
              date={
                getValues("dateDebut")
                  ? toDate(getValues("dateDebut"))
                  : undefined
              }
              onDateChange={(date) => {
                setValue("dateDebut", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              maxDate={
                getValues("dateFin") ? toDate(getValues("dateFin")) : undefined
              }
              configs={getDatePickerConfig()}
            />
            {!!errors.dateDebut && (
              <FormErrorMessage>{errors.dateDebut.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.dateFin} isRequired>
            <FormLabel>Date de fin</FormLabel>
            <SingleDatepicker
              date={
                getValues("dateFin") ? toDate(getValues("dateFin")) : undefined
              }
              onDateChange={(date) => {
                setValue("dateFin", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              minDate={
                getValues("dateDebut")
                  ? toDate(getValues("dateDebut"))
                  : undefined
              }
              configs={getDatePickerConfig()}
            />
            {!!errors.dateFin && (
              <FormErrorMessage>{errors.dateFin.message}</FormErrorMessage>
            )}
          </FormControl>
          {isError && (
            <Alert status="error">
              {serverErrors ? (
                <UnorderedList>
                  {Object.entries(serverErrors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </UnorderedList>
              ) : (
                <AlertDescription>Erreur lors de la création</AlertDescription>
              )}
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
