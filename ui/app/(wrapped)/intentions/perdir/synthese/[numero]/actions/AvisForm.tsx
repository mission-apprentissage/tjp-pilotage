import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
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
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { AvisStatutEnum, AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisTypeType } from "shared/enum/avisTypeEnum";

import { client } from "@/api.client";
import { getTypeAvis } from "@/app/(wrapped)/intentions/utils/statutUtils";

import { AvisStatutTag } from "../../../components/AvisStatutTag";
import { FonctionTag } from "../../../components/FonctionTag";
import { RoleVisibleTag } from "../../../components/RoleVisibleTag";
import { FONCTIONS } from "./FONCTIONS";

type AvisForm = {
  id: string;
  userId: string;
  intentionNumero: string;
  statutAvis: AvisStatutType;
  typeAvis: AvisTypeType;
  commentaire?: string;
  isVisibleParTous: boolean;
  userFonction: string;
};

export const AvisForm = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AvisForm>({
    defaultValues: {
      intentionNumero: intention.numero,
      statutAvis: undefined,
      typeAvis: getTypeAvis(intention.statut),
      commentaire: undefined,
      isVisibleParTous: undefined,
      userFonction: undefined,
    },
    mode: "onTouched",
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    getValues,
    control,
    watch,
  } = form;

  const isVisibleParTous = watch("isVisibleParTous");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading: isSubmitting, mutateAsync: submitAvis } = client
    .ref("[POST]/intention/avis/submit")
    .useMutation({
      onSuccess: (body) => {
        let message: string | null = null;

        const { statutAvis, typeAvis } = body;
        message = `Vous avez bien rentré un avis ${typeAvis} ${statutAvis}`;

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
          submitAvis({
            body: { avis: values },
          })
        )}
      >
        <Heading as="h2" fontSize={18} fontWeight={700} mb={4}>
          Exprimer un vote {getTypeAvis(intention.statut)}
        </Heading>
        <FormControl isInvalid={!!errors.userFonction} isRequired>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
            Exprimer un vote en tant que
          </FormLabel>
          <Controller
            name="userFonction"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CreatableSelect
                name={name}
                onChange={(selected) => {
                  onChange(selected?.value);
                }}
                defaultValue={
                  value
                    ? {
                        value: value,
                        label: value?.toUpperCase() ?? "",
                      }
                    : undefined
                }
                placeholder="Sélectionner une option"
                options={FONCTIONS.map((fonction) => ({
                  label: fonction.toUpperCase(),
                  value: fonction,
                }))}
                formatOptionLabel={(option: { label: string }) =>
                  option.label.startsWith("Créer la fonction") ? (
                    option.label
                  ) : (
                    <FonctionTag fonction={option.label} />
                  )
                }
                isClearable
                formatCreateLabel={(inputValue) =>
                  `Créer la fonction ${inputValue}`
                }
              />
            )}
          />
          {errors.userFonction && (
            <FormErrorMessage>{errors.userFonction.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.statutAvis} isRequired>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
            Avis sur la proposition
          </FormLabel>

          <Controller
            name="statutAvis"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <Select
                name={name}
                onChange={(selected) => {
                  onChange(selected?.value);
                }}
                defaultValue={
                  value
                    ? {
                        value: value,
                        label: value?.toUpperCase() ?? "",
                      }
                    : undefined
                }
                placeholder="Sélectionner une option"
                options={Object.values(AvisStatutEnum).map((avis) => ({
                  label: avis.toUpperCase(),
                  value: avis,
                }))}
                formatOptionLabel={(option: { value: string }) => (
                  <AvisStatutTag
                    statutAvis={option.value as AvisStatutType}
                    size="md"
                    hasIcon
                    textTransform={"uppercase"}
                    gap={2}
                  />
                )}
                isClearable
              />
            )}
          />
          {errors.statutAvis && (
            <FormErrorMessage>{errors.statutAvis.message}</FormErrorMessage>
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
        <FormControl mt={3}>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
            Cet avis est visible uniquement par les administrateurs et pilotes.
            Vous avez la possibilité de rendre votre avis visible de tous en
            cochant la case ci-dessous.
          </FormLabel>
          <Checkbox
            size="lg"
            {...register("isVisibleParTous", {
              required: false,
            })}
            whiteSpace={"nowrap"}
          >
            <Text fontSize={"14px"} fontWeight={400}>
              Rendre cet avis visible de tous
            </Text>
          </Checkbox>
        </FormControl>
        <Flex direction={"column"} gap={3} mt={2}>
          <Flex direction={"row"} gap={3}>
            <RoleVisibleTag role={"Administrateurs"} isChecked={true} />
            <RoleVisibleTag role={"Pilotes"} isChecked={true} />
          </Flex>
          <Flex direction={"row"} gap={3}>
            <RoleVisibleTag role={"Experts"} isChecked={!!isVisibleParTous} />
            <RoleVisibleTag role={"PERDIR"} isChecked={!!isVisibleParTous} />
            <RoleVisibleTag role={"Région"} isChecked={!!isVisibleParTous} />
          </Flex>
        </Flex>
        <Button
          isLoading={isSubmitting}
          variant="primary"
          onClick={() => {
            form.trigger().then((isValid) => {
              if (isValid) onOpen();
            });
            console.log(getValues());
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
              Confirmer le dépôt de l'avis {getTypeAvis(intention.statut)}
            </ModalHeader>
            <ModalBody>
              <Highlight
                query={[
                  getValues("statutAvis"),
                  getValues("typeAvis"),
                  getValues("userFonction"),
                  intention.numero!,
                ]}
                styles={{ fontWeight: 700 }}
              >
                {`Souhaitez-vous déposer un avis ${getValues(
                  "typeAvis"
                )} ${getValues("statutAvis")} en tant que ${getValues(
                  "userFonction"
                )} pour la demande ${intention.numero} ?`}
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
                onClick={handleSubmit((values) => {
                  console.log(values);
                  submitAvis({
                    body: {
                      avis: values,
                    },
                  });
                })}
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
