import {
  Alert,
  AlertDescription,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { DatepickerConfigs, SingleDatepicker } from "chakra-dayzed-datepicker";
import { toDate } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { client } from "../../../../api.client";

const DATE_PICKER_CONFIG = {
  dateFormat: "dd/MM/yyyy",
  dayNames: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  firstDayOfWeek: 1,
} as DatepickerConfigs;

export const EditCampagne = ({
  isOpen,
  onClose,
  campagne,
}: {
  isOpen: boolean;
  onClose: () => void;
  campagne: (typeof client.infer)["[GET]/campagnes"][number];
}) => {
  const {
    getValues,
    setValue,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<(typeof client.inferArgs)["[PUT]/campagnes/:campagneId"]["body"]>(
    {
      shouldUseNativeValidation: false,
      defaultValues: {
        statut: campagne.statut,
        dateFin: campagne.dateFin,
        dateDebut: campagne.dateDebut,
      },
    }
  );

  useEffect(() => {
    reset(campagne, { keepDefaultValues: true });
  }, [isOpen, reset]);

  const queryClient = useQueryClient();

  const {
    mutate: editCampagne,
    isLoading,
    isError,
  } = client.ref("[PUT]/campagnes/:campagneId").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/campagnes"]);
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit((form) =>
          editCampagne({
            body: {
              ...form,
              dateDebut: toDate(form.dateDebut).toISOString(),
              dateFin: toDate(form.dateFin).toISOString(),
            },
            params: { campagneId: campagne?.id },
          })
        )}
      >
        <ModalHeader>Éditer une campagne</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.annee} isRequired>
            <FormLabel>Année</FormLabel>
            <Input
              type="text"
              {...register("annee", {
                validate: (annee) =>
                  z
                    .string()
                    .regex(/^\d{4}$/)
                    .safeParse(annee).success ||
                  "Veuillez saisir une année valide",
              })}
            />
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
              {["en attente", "en cours", "terminée"].map((statut) => (
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
              configs={DATE_PICKER_CONFIG}
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
              configs={DATE_PICKER_CONFIG}
            />
            {!!errors.dateFin && (
              <FormErrorMessage>{errors.dateFin.message}</FormErrorMessage>
            )}
          </FormControl>
          {isError && (
            <Alert status="error">
              <AlertDescription>Erreur lors de la création</AlertDescription>
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
