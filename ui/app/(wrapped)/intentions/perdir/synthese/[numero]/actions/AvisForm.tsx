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
import type { AxiosError } from "axios";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisStatutEnum } from "shared/enum/avisStatutEnum";
import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { escapeString } from "shared/utils/escapeString";

import { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/intentions/perdir/components/AvisStatutTag";
import { FonctionTag } from "@/app/(wrapped)/intentions/perdir/components/FonctionTag";
import { RoleVisibleTag } from "@/app/(wrapped)/intentions/perdir/components/RoleVisibleTag";
import { getTypeAvis } from "@/app/(wrapped)/intentions/utils/statutUtils";

import { FONCTIONS } from "./FONCTIONS";

type Option = {
  readonly label: string;
  readonly value: string;
};

type AvisForm = {
  id: string;
  createdBy: string;
  intentionNumero: string;
  statutAvis: AvisStatutType;
  typeAvis: AvisTypeType;
  commentaire?: string;
  isVisibleParTous: boolean;
  userFonction: string;
};

export const AvisForm = ({ intention }: { intention: (typeof client.infer)["[GET]/intention/:numero"] }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AvisForm>({
    defaultValues: {
      intentionNumero: intention.numero,
      statutAvis: undefined,
      typeAvis: getTypeAvis(intention.statut),
      commentaire: undefined,
      isVisibleParTous: getTypeAvis(intention.statut) !== AvisTypeEnum["consultatif"],
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

  const { isLoading: isSubmitting, mutateAsync: submitAvis } = client.ref("[POST]/intention/avis/submit").useMutation({
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

  const getLabelAvis = (statut?: DemandeStatutType): string => {
    const typeAvis = getTypeAvis(statut);
    switch (typeAvis) {
      case AvisTypeEnum["préalable"]:
        return `avis préalable`;
      case AvisTypeEnum["consultatif"]:
        return `avis consultatif`;
      case AvisTypeEnum["final"]:
        return `vote`;
      default:
        return `avis`;
    }
  };

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
            body: {
              avis: {
                ...values,
                commentaire: escapeString(values.commentaire),
              },
            },
          })
        )}
      >
        <Heading as="h2" fontSize={18} fontWeight={700} mb={4}>
          Exprimer un {getLabelAvis(intention.statut)}
        </Heading>
        <FormControl isInvalid={!!errors.userFonction} isRequired>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
            Exprimer un {getLabelAvis(intention.statut)} en tant que
          </FormLabel>
          <Controller
            name="userFonction"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CreatableSelect<Option>
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
                options={FONCTIONS[getTypeAvis(intention.statut)].map((fonction) => ({
                  label: fonction.toUpperCase(),
                  value: fonction,
                }))}
                formatOptionLabel={(option: { label: string }) =>
                  option.label.startsWith("Créer la fonction") ? option.label : <FonctionTag fonction={option.label} />
                }
                isClearable
                formatCreateLabel={(inputValue) => `Créer la fonction ${inputValue}`}
              />
            )}
          />
          {errors.userFonction && <FormErrorMessage>{errors.userFonction.message}</FormErrorMessage>}
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
              <Select<Option>
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
          {errors.statutAvis && <FormErrorMessage>{errors.statutAvis.message}</FormErrorMessage>}
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
        {getTypeAvis(intention.statut) === AvisTypeEnum["consultatif"] ? (
          <FormControl mt={3}>
            <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
              Cet avis est visible uniquement par les administrateurs et pilotes. Vous avez la possibilité de rendre
              votre avis visible de tous en cochant la case ci-dessous.
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
        ) : (
          <Text mt={3}>{`Cet avis ${getTypeAvis(intention.statut)} sera visible de toutes les parties prenantes`}</Text>
        )}
        <Flex direction={"column"} gap={3} mt={2}>
          <Flex direction={"row"} gap={3}>
            <RoleVisibleTag role={"Administrateurs"} isChecked={true} />
            <RoleVisibleTag role={"Pilotes"} isChecked={true} />
          </Flex>
          <Flex direction={"row"} gap={3}>
            <RoleVisibleTag
              role={"Experts"}
              isChecked={!!isVisibleParTous || getTypeAvis(intention.statut) != AvisTypeEnum["consultatif"]}
            />
            <RoleVisibleTag
              role={"PERDIR"}
              isChecked={!!isVisibleParTous || getTypeAvis(intention.statut) != AvisTypeEnum["consultatif"]}
            />
            <RoleVisibleTag
              role={"Région"}
              isChecked={!!isVisibleParTous || getTypeAvis(intention.statut) != AvisTypeEnum["consultatif"]}
            />
          </Flex>
        </Flex>
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
              Confirmer le dépôt de l'avis {getTypeAvis(intention.statut)}
            </ModalHeader>
            <ModalBody>
              <Highlight
                query={[
                  getValues("statutAvis"),
                  getValues("userFonction"),
                  getTypeAvis(intention.statut),
                  intention.numero!,
                ]}
                styles={{ fontWeight: 700 }}
              >
                {`Souhaitez-vous déposer un avis ${getTypeAvis(
                  intention.statut
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
                  submitAvis({
                    body: {
                      avis: {
                        ...values,
                        typeAvis: getTypeAvis(intention.statut),
                        commentaire: escapeString(values.commentaire),
                      },
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
