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
  UnorderedList,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { toDate } from "date-fns";
import {useContext,useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { z } from "zod";

import { client } from "@/api.client";
import {PreviousCampagneContext} from '@/app/previousCampagneContext';
import { getDatePickerConfig } from "@/utils/getDatePickerConfig";
import {useCurrentCampagne} from '@/utils/security/useCurrentCampagne';

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
  } = useForm<(typeof client.inferArgs)["[PUT]/campagnes/:campagneId"]["body"]>({
    shouldUseNativeValidation: false,
    defaultValues: {
      statut: campagne.statut,
      dateFin: campagne.dateFin,
      dateDebut: campagne.dateDebut,
    },
  });

  useEffect(() => {
    reset(campagne, { keepDefaultValues: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset]);

  const queryClient = useQueryClient();

  const [serverErrors, setServerErrors] = useState<Record<string, string>>();
  const { setCampagne: setCurrentCampagne } = useCurrentCampagne();
  const { setCampagne: setPreviousCampagne } = useContext(PreviousCampagneContext);

  const {
    mutate: editCampagne,
    isLoading,
    isError,
  } = client.ref("[PUT]/campagnes/:campagneId").useMutation({
    onSuccess: async () => {
      queryClient.invalidateQueries(["[GET]/campagnes"]);
      await client.ref("[GET]/campagne/current").query({}).then((campagne) => {
        setCurrentCampagne(campagne.current);
        setPreviousCampagne(campagne.previous);
      });
      onClose();
    },
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setServerErrors(errors);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
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
          })
        )}
      >
        <ModalHeader>Éditer une campagne</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.annee} isRequired>
            <FormLabel>Année</FormLabel>
            <Input
              width={[null, null, "72"]}
              type="text"
              {...register("annee", {
                validate: (annee) =>
                  z
                    .string()
                    .regex(/^\d{4}$/)
                    .safeParse(annee).success || "Veuillez saisir une année valide",
              })}
            />
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
            <FormLabel>Date début</FormLabel>
            <SingleDatepicker
              date={getValues("dateDebut") ? toDate(getValues("dateDebut")) : undefined}
              onDateChange={(date) => {
                setValue("dateDebut", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              maxDate={getValues("dateFin") ? toDate(getValues("dateFin")) : undefined}
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
            <FormLabel>Date de fin</FormLabel>
            <SingleDatepicker
              date={getValues("dateFin") ? toDate(getValues("dateFin")) : undefined}
              onDateChange={(date) => {
                setValue("dateFin", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              minDate={getValues("dateDebut") ? toDate(getValues("dateDebut")) : undefined}
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
            {!!errors.dateFin && <FormErrorMessage>{errors.dateFin.message}</FormErrorMessage>}
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
                <AlertDescription>Erreur lors de l'édition</AlertDescription>
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
