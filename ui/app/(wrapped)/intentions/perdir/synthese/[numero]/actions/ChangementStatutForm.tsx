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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";

import { formatStatut, getOrderStatut } from "../../../../utils/statutUtils";

type ChangementStatutForm = {
  intentionNumero: string;
  statutPrecedent?: Exclude<DemandeStatutType, "supprimée">;
  statut: Exclude<DemandeStatutType, "supprimée">;
  commentaire?: string;
};

export const ChangementStatutForm = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ChangementStatutForm>({
    defaultValues: {
      intentionNumero: intention.numero,
      statutPrecedent: intention.statut,
      statut: intention.statut,
      commentaire: intention.commentaireStatut,
    },
    mode: "onTouched",
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = form;

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "statut") return;
        if (
          getValues("statut") === intention.statut &&
          !getValues("commentaire")
        )
          setValue("commentaire", intention.commentaireStatut);
        else setValue("commentaire", undefined);
      }).unsubscribe
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading: isSubmitting, mutateAsync: submitChangementStatut } =
    client.ref("[POST]/intention/statut/submit").useMutation({
      onSuccess: (body) => {
        let message: string | null = null;

        const { statut, statutPrecedent } = body;
        message = `Le statut de la demande a été changé depuis ${formatStatut(
          statutPrecedent
        )} vers ${formatStatut(statut)}`;

        onClose();
        queryClient.invalidateQueries(["[GET]/intention/:numero"]);
        if (message) {
          toast({
            variant: "left-accent",
            status: "success",
            title: message,
          });
        }
      },
      //@ts-ignore
      onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
        const errors = e.response?.data.errors;
        console.error(errors);
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
        onSubmit={handleSubmit((values) =>
          submitChangementStatut({
            body: { changementStatut: values },
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
                if (value === intention.statut) {
                  // setError("statut", {
                  //   message: "Le statut n'a pas changé",
                  // });
                  return "Le statut n'a pas changé";
                }
              },
            })}
            placeholder="Sélectionner une option"
            isInvalid={!!errors.statut}
          >
            {Object.values(DemandeStatutEnum)
              .filter((statut) => statut !== DemandeStatutEnum["supprimée"])
              .sort((a, b) => getOrderStatut(a) - getOrderStatut(b))
              .map((statut) => (
                <option
                  key={statut}
                  value={statut}
                  // disabled={
                  //   getOrderStatut(statut) < getOrderStatut(intention.statut)
                  // }
                >
                  {formatStatut(statut)}
                </option>
              ))}
          </Select>
          {errors.statut && (
            <FormErrorMessage>{errors.statut.message}</FormErrorMessage>
          )}
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
          // isDisabled={
          //   // disabled ||
          //   // isActionsDisabled ||
          //   // campagne?.statut !== CampagneStatutEnum["en cours"]
          // }
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
          Enregister
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
                query={[
                  formatStatut(intention.statut),
                  formatStatut(getValues("statut")),
                ]}
                styles={{ fontWeight: 700 }}
              >
                {`Souhaitez-vous changer le statut de la demande depuis ${formatStatut(
                  intention.statut
                )} vers ${formatStatut(getValues("statut"))} ?`}
              </Highlight>
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
                onClick={handleSubmit((values) =>
                  submitChangementStatut({
                    body: {
                      changementStatut: values,
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
