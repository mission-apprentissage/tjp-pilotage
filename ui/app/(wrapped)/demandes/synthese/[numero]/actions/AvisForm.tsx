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
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { TypeAvisEnum } from "shared/enum/typeAvisEnum";
import { escapeString } from "shared/utils/escapeString";

import { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/demandes/components/AvisStatutTag";
import { FonctionTag } from "@/app/(wrapped)/demandes/components/FonctionTag";
import { RoleVisibleTag } from "@/app/(wrapped)/demandes/components/RoleVisibleTag";
import type { AvisFormType } from "@/app/(wrapped)/demandes/synthese/[numero]/types";
import { getTypeAvis } from "@/app/(wrapped)/demandes/utils/statutUtils";

import { FONCTIONS } from "./FONCTIONS";

type Option = {
  readonly label: string;
  readonly value: string;
};

const getAvisOptionLabel = (option: { value: string }) => (
  <AvisStatutTag
    statutAvis={option.value as AvisStatutType}
    size="md"
    hasIcon
    textTransform={"uppercase"}
    gap={2}
  />
);

const getFonctionOptionLabel = (option: { label: string }) =>
  option.label.startsWith("Créer la fonction") ? option.label : <FonctionTag fonction={option.label} />;

export const AvisForm = ({ demande }: { demande: (typeof client.infer)["[GET]/demande/:numero"] }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AvisFormType>({
    defaultValues: {
      demandeNumero: demande.numero,
      statutAvis: undefined,
      typeAvis: getTypeAvis(demande.statut),
      commentaire: undefined,
      isVisibleParTous: getTypeAvis(demande.statut) !== TypeAvisEnum["consultatif"],
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

  const { isLoading: isSubmitting, mutateAsync: submitAvis } = client.ref("[POST]/demande/avis/submit").useMutation({
    onSuccess: (body) => {
      let message: string | null = null;

      const { statutAvis, typeAvis } = body;
      message = `Vous avez bien rentré un avis ${typeAvis} ${statutAvis}`;

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
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      console.error(errors);
    },
  });

  const getLabelAvis = (statut?: DemandeStatutType): string => {
    const typeAvis = getTypeAvis(statut);
    switch (typeAvis) {
    case TypeAvisEnum["préalable"]:
      return `avis préalable`;
    case TypeAvisEnum["consultatif"]:
      return `avis consultatif`;
    case TypeAvisEnum["final"]:
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
        onSubmit={handleSubmit(async (values) =>
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
          Exprimer un {getLabelAvis(demande.statut)}
        </Heading>
        <FormControl isInvalid={!!errors.userFonction} isRequired>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"} htmlFor="userFonction">
            Exprimer un {getLabelAvis(demande.statut)} en tant que
          </FormLabel>
          <Controller
            name="userFonction"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CreatableSelect<Option>
                inputId="userFonction"
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
                options={FONCTIONS[getTypeAvis(demande.statut)].map((fonction) => ({
                  label: fonction.toUpperCase(),
                  value: fonction,
                }))}
                formatOptionLabel={getFonctionOptionLabel}
                isClearable
                formatCreateLabel={(inputValue) => `Créer la fonction ${inputValue}`}
              />
            )}
          />
          {errors.userFonction && <FormErrorMessage>{errors.userFonction.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.statutAvis} isRequired>
          <FormLabel fontSize={12} fontWeight={400} color={"grey.425"} htmlFor="statutAvis">
            Avis sur la proposition
          </FormLabel>
          <Controller
            name="statutAvis"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <Select<Option>
                inputId="statutAvis"
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
                formatOptionLabel={getAvisOptionLabel}
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
        {getTypeAvis(demande.statut) === TypeAvisEnum["consultatif"] ? (
          <Text mt={3}>{`Cet avis ${getTypeAvis(demande.statut)} est visible uniquement par les administrateurs et pilotes`}</Text>
        ) : (
          <Text mt={3}>{`Cet avis ${getTypeAvis(demande.statut)} sera visible de toutes les parties prenantes`}</Text>
        )}
        <Flex direction={"column"} gap={3} mt={2}>
          <Flex direction={"row"} gap={3}>
            <RoleVisibleTag role={"Administrateurs"} isChecked={true} />
            <RoleVisibleTag role={"Pilotes"} isChecked={true} />
          </Flex>
          <Flex direction={"row"} gap={3}>
            <RoleVisibleTag
              role={"Experts"}
              isChecked={!!isVisibleParTous || getTypeAvis(demande.statut) != TypeAvisEnum["consultatif"]}
            />
            <RoleVisibleTag
              role={"PERDIR"}
              isChecked={!!isVisibleParTous || getTypeAvis(demande.statut) != TypeAvisEnum["consultatif"]}
            />
            <RoleVisibleTag
              role={"Région"}
              isChecked={!!isVisibleParTous || getTypeAvis(demande.statut) != TypeAvisEnum["consultatif"]}
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
              Confirmer le dépôt de l'avis {getTypeAvis(demande.statut)}
            </ModalHeader>
            <ModalBody>
              <Highlight
                query={[
                  getValues("statutAvis"),
                  getValues("userFonction") ?? "",
                  getTypeAvis(demande.statut),
                  demande.numero!,
                ]}
                styles={{ fontWeight: 700 }}
              >
                {`Souhaitez-vous déposer un avis ${getTypeAvis(
                  demande.statut
                )} ${getValues("statutAvis")} en tant que ${getValues(
                  "userFonction"
                )} pour la demande ${demande.numero} ?`}
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
                        typeAvis: getTypeAvis(demande.statut),
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
