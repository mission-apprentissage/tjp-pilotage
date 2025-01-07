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
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisStatutEnum } from "shared/enum/avisStatutEnum";
import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";

import { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/intentions/perdir/components/AvisStatutTag";
import { FonctionTag } from "@/app/(wrapped)/intentions/perdir/components/FonctionTag";
import { RoleVisibleTag } from "@/app/(wrapped)/intentions/perdir/components/RoleVisibleTag";
import type { AvisForm } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/actions/AvisForm";
import { FONCTIONS } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/actions/FONCTIONS";

type AvisForm = {
  id: string;
  createdBy: string;
  updatedBy?: string;
  intentionNumero: string;
  statutAvis: AvisStatutType;
  typeAvis: AvisTypeType;
  commentaire?: string;
  isVisibleParTous: boolean;
  userFonction?: string;
};

export const UpdateAvisForm = chakra(
  ({
    avis,
    setIsModifying,
    onToggleUpdateAvis,
  }: {
    avis: AvisForm;
    setIsModifying: (value: boolean) => void;
    onToggleUpdateAvis: () => void;
  }) => {
    const queryClient = useQueryClient();

    const form = useForm<AvisForm>({
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
      .ref("[POST]/intention/avis/submit")
      .useMutation({
        onSuccess: (_body) => {
          queryClient.invalidateQueries(["[GET]/intention/:numero"]);
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
                        value: `${value}`,
                        // @ts-expect-error TODO
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
                    <AvisStatutTag statutAvis={option.value as AvisStatutType} size="md" />
                  )}
                  isClearable
                />
              )}
            />
            {errors.statutAvis && <FormErrorMessage>{errors.statutAvis.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.userFonction} isRequired>
            <FormLabel fontSize={12} fontWeight={400} color={"grey.425"}>
              En tant que
            </FormLabel>
            <Controller
              name="userFonction"
              control={control}
              rules={{ required: "Ce champs est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <CreatableSelect
                  name={name}
                  onChange={(selected) => {
                    // @ts-expect-error TODO
                    onChange(selected?.value);
                  }}
                  defaultValue={
                    value
                      ? {
                        // @ts-expect-error TODO
                        value: value,
                        label: value?.toUpperCase() ?? "",
                      }
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
                  isChecked={!!isVisibleParTous || avis.typeAvis != AvisTypeEnum["consultatif"]}
                />
                <RoleVisibleTag
                  role={"PERDIR"}
                  isChecked={!!isVisibleParTous || avis.typeAvis != AvisTypeEnum["consultatif"]}
                />
                <RoleVisibleTag
                  role={"Région"}
                  isChecked={!!isVisibleParTous || avis.typeAvis != AvisTypeEnum["consultatif"]}
                />
              </Flex>
            </Flex>
            {avis.typeAvis === AvisTypeEnum["consultatif"] && (
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
            )}
          </FormControl>
          <Button
            isLoading={isSubmitting}
            variant="primary"
            onClick={handleSubmit((values) =>
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
