import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useId } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisStatutEnum } from "shared/enum/avisStatutEnum";
import { TypeAvisEnum } from "shared/enum/typeAvisEnum";

import { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/demandes/components/AvisStatutTag";
import { FonctionTag } from "@/app/(wrapped)/demandes/components/FonctionTag";
import { RoleVisibleTag } from "@/app/(wrapped)/demandes/components/RoleVisibleTag";
import { FONCTIONS } from "@/app/(wrapped)/demandes/synthese/[numero]/actions/FONCTIONS";
import type { AvisFormType } from "@/app/(wrapped)/demandes/synthese/[numero]/types";

export const UpdateAvisForm = chakra(
  ({
    avis,
    setIsModifying,
    onToggleUpdateAvis,
  }: {
    avis: AvisFormType;
    setIsModifying: (value: boolean) => void;
    onToggleUpdateAvis: () => void;
  }) => {
    const queryClient = useQueryClient();

    const form = useForm<AvisFormType>({
      defaultValues: {
        ...avis,
      },
      mode: "onTouched",
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      watch,
    } = form;

    const { isLoading: isSubmitting, mutateAsync: submitAvis } = client
      .ref("[POST]/demande/avis/submit")
      .useMutation({
        onSuccess: (_body) => {
          queryClient.invalidateQueries(["[GET]/demande/:numero"]);
          setIsModifying(false);
          onToggleUpdateAvis();
        },
        //@ts-ignore
        onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
          const errors = e.response?.data.errors;
          console.error(errors);
        },
      });

    const isVisibleParTous = watch("isVisibleParTous");
    const updateStatutAvisId = useId();
    const updateFonctionAvisId = useId();

    return (
      <FormProvider {...form}>
        <Flex
          direction={"column"}
          gap={3}
          as="form"
          noValidate
          onSubmit={handleSubmit((values) =>
            submitAvis({
              body: { avis: values },
            })
          )}
          width={"50%"}
        >
          <FormControl isInvalid={!!errors.statutAvis} isRequired>
            <FormLabel fontSize={12} fontWeight={400} color={"grey.425"} htmlFor={updateStatutAvisId}>
              Avis sur la proposition
            </FormLabel>
            <Controller
              name="statutAvis"
              control={control}
              rules={{ required: "Ce champs est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  inputId={updateStatutAvisId}
                  name={name}
                  onChange={(selected) => {
                    onChange(selected?.value);
                  }}
                  defaultValue={{value}}
                  placeholder="Sélectionner une option"
                  options={Object.values(AvisStatutEnum).map((avis) => ({
                    label: avis.toUpperCase(),
                    value: avis,
                  }))}
                  formatOptionLabel={(option: { value: string }) => (
                    <AvisStatutTag statutAvis={option.value as AvisStatutType} size="md" />
                  )}
                  isClearable
                />
              )}
            />
            {errors.statutAvis && <FormErrorMessage>{errors.statutAvis.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.userFonction} isRequired>
            <FormLabel fontSize={12} fontWeight={400} color={"grey.425"} htmlFor={updateFonctionAvisId}>
              En tant que
            </FormLabel>
            <Controller
              name="userFonction"
              control={control}
              rules={{ required: "Ce champs est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <CreatableSelect
                  inputId={updateFonctionAvisId}
                  name={name}
                  onChange={(selected) => {
                    onChange(selected?.label);
                  }}
                  defaultValue={
                    value
                      ? { label: value?.toUpperCase() ?? "" }
                      : undefined
                  }
                  placeholder="Sélectionner une option"
                  options={FONCTIONS[avis.typeAvis].map((fonction) => ({
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
                  formatCreateLabel={(inputValue) => `Créer la fonction ${inputValue}`}
                />
              )}
            />
            {errors.userFonction && <FormErrorMessage>{errors.userFonction.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.commentaire} isRequired>
            <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
              Observations
            </FormLabel>
            <Textarea
              {...register("commentaire", {
                required: false,
              })}
              isDisabled={isSubmitting}
              placeholder="Observation"
              bgColor={"grey.925"}
              rows={8}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
              Visible par
            </FormLabel>
            <Flex direction={"column"} gap={3} my={2}>
              <Flex direction={"row"} gap={3}>
                <RoleVisibleTag role={"Administrateurs"} isChecked={true} />
                <RoleVisibleTag role={"Pilotes"} isChecked={true} />
              </Flex>
              <Flex direction={"row"} gap={3}>
                <RoleVisibleTag
                  role={"Experts"}
                  isChecked={!!isVisibleParTous || avis.typeAvis != TypeAvisEnum["consultatif"]}
                />
                <RoleVisibleTag
                  role={"PERDIR"}
                  isChecked={!!isVisibleParTous || avis.typeAvis != TypeAvisEnum["consultatif"]}
                />
                <RoleVisibleTag
                  role={"Région"}
                  isChecked={!!isVisibleParTous || avis.typeAvis != TypeAvisEnum["consultatif"]}
                />
              </Flex>
            </Flex>
            {avis.typeAvis === TypeAvisEnum["consultatif"] && (
              <Checkbox
                size="lg"
                {...register("isVisibleParTous", {
                  required: false,
                })}
                whiteSpace={"nowrap"}
              >
                <Text fontSize={14} fontWeight={400}>
                  Rendre cet avis visible de tous
                </Text>
              </Checkbox>
            )}
          </FormControl>
          <Button
            isLoading={isSubmitting}
            variant="primary"
            onClick={handleSubmit(async (values) =>
              submitAvis({
                body: {
                  avis: values,
                },
              })
            )}
            leftIcon={<CheckIcon />}
            width={"100%"}
          >
            Enregistrer
          </Button>
        </Flex>
      </FormProvider>
    );
  }
);
