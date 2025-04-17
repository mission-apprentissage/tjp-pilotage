import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { escapeString } from "shared/utils/escapeString";

import { client } from "@/api.client";
import type { ChangementStatutFormType } from "@/app/(wrapped)/demandes/synthese/[numero]/types";
import {formatStatut, getOrderedStatutsOptions, getPossibleNextStatuts, getStepWorkflow} from '@/app/(wrapped)/demandes/utils/statutUtils';
import { useAuth } from "@/utils/security/useAuth";


export const ChangementStatutForm = ({
  demande,
}: {
  demande: (typeof client.infer)["[GET]/demande/:numero"];
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ChangementStatutFormType>({
    mode: "onTouched",
  });

  useEffect(() => {
    form.reset({
      demandeNumero: demande.numero,
      statutPrecedent: demande.statut,
      statut: demande.statut,
      commentaire: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demande]);

  const {
    formState: { errors },
    register,
    handleSubmit,
    getValues,
  } = form;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading: isSubmitting, mutateAsync: submitChangementStatut } = client
    .ref("[POST]/demande/statut/submit")
    .useMutation({
      onSuccess: (body) => {
        let message: string | null = null;

        const { statut, statutPrecedent } = body;
        message = `Le statut de la demande a été changé depuis ${formatStatut(
          statutPrecedent
        )} vers ${formatStatut(statut)}`;

        onClose();
        queryClient.invalidateQueries(["[GET]/demande/:numero"]);

        if (message) {
          toast({
            variant: "left-accent",
            status: "success",
            title: message,
          });
        }
      },
      onError: (e: unknown) => {
        if (isAxiosError<Record<string, string>>(e)) {
          const errors = e.response?.data.errors;
          console.error(errors);
        }
      },
    });

  return (
    <FormProvider {...form}>
      <Flex
        direction={"column"}
        gap={3}
        bgColor={"white"}
        borderRadius={6}
        p={6}
        as="form"
        noValidate
        onSubmit={handleSubmit(async (values) =>
          submitChangementStatut({
            body: {
              changementStatut: {
                ...values,
                commentaire: escapeString(values.commentaire),
              },
            },
          })
        )}
      >
        <Heading as="h2" fontSize={18} fontWeight={700} mb={4}>
          Changer le statut
        </Heading>
        <FormControl isInvalid={!!errors.statut} isRequired>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
            Changer le statut de la demande
          </FormLabel>
          <Select
            bg="white"
            {...register("statut", {
              required: "Le statut est obligatoire",
              validate: (value) => {
                if (value === demande.statut) {
                  return "Le statut n'a pas changé";
                }
              },
            })}
            placeholder="Sélectionner une option"
            isInvalid={!!errors.statut}
          >
            {getOrderedStatutsOptions()
              .map((statut) => (
                <option
                  key={statut}
                  value={statut}
                  disabled={!getPossibleNextStatuts({statut: demande.statut, user}).includes(statut)}
                >
                  {formatStatut(statut)}
                </option>
              ))}
          </Select>
          {errors.statut && <FormErrorMessage>{errors.statut.message}</FormErrorMessage>}
        </FormControl>
        <FormControl>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
            Observations
          </FormLabel>
          <Textarea
            {...register("commentaire", {
              required: false,
            })}
            placeholder="Observation"
            bgColor={"grey.925"}
            rows={8}
          />
        </FormControl>
        <Button
          isLoading={isSubmitting}
          variant="primary"
          onClick={() => {
            form.trigger().then((isValid) => {
              if (isValid) onOpen();
            });
          }}
          leftIcon={<CheckIcon />}
          width={"100%"}
        >
          Enregistrer
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
          <ModalOverlay />
          <ModalContent p="4">
            <ModalCloseButton title="Fermer" />
            <ModalHeader>
              <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
              Confirmer le changement de statut
            </ModalHeader>
            <ModalBody>
              <Highlight
                query={[formatStatut(demande.statut), formatStatut(getValues("statut"))]}
                styles={{ fontWeight: 700 }}
              >
                {`Souhaitez-vous changer le statut de la demande depuis ${formatStatut(
                  demande.statut
                )} vers ${formatStatut(getValues("statut"))} ?`}
              </Highlight>
              {getStepWorkflow(getValues("statut")) > getStepWorkflow(demande.statut) && (
                <Text color="red" mt={2}>
                  Attention, ce changement est irréversible
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  onClose();
                }}
                variant={"secondary"}
              >
                Annuler
              </Button>
              <Button
                isLoading={isSubmitting}
                variant="primary"
                onClick={handleSubmit(async (values) =>
                  submitChangementStatut({
                    body: {
                      changementStatut: {
                        ...values,
                        commentaire: escapeString(values.commentaire),
                      },
                    },
                  })
                )}
              >
                Confirmer le changement
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </FormProvider>
  );
};
