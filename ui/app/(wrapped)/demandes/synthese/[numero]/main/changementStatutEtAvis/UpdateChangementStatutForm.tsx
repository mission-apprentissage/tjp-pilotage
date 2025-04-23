import { CheckIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, Textarea, VisuallyHidden } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useId } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { client } from "@/api.client";
import type {ChangementStatutFormType} from '@/app/(wrapped)/demandes/synthese/[numero]/types';

export const UpdateChangementStatutForm = chakra(
  ({
    changementStatut,
    setIsModifying,
    onToggleUpdateChangementStatut,
  }: {
    changementStatut: ChangementStatutFormType;
    setIsModifying: (value: boolean) => void;
    onToggleUpdateChangementStatut: () => void;
  }) => {
    const queryClient = useQueryClient();

    const form = useForm<ChangementStatutFormType>({
      defaultValues: {
        ...changementStatut,
      },
      mode: "onTouched",
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = form;

    const { isLoading: isSubmitting, mutateAsync: submitChangementStatut } = client
      .ref("[POST]/demande/statut/submit")
      .useMutation({
        onSuccess: (_body) => {
          queryClient.invalidateQueries(["[GET]/demande/:numero"]);
          setIsModifying(false);
          onToggleUpdateChangementStatut();
        },
        //@ts-ignore
        onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
          const errors = e.response?.data.errors;
          console.error(errors);
        },
      });

    const updateCommentaireChangementStatutId = useId();

    return (
      <FormProvider {...form}>
        <Flex
          direction={"column"}
          gap={2}
          as="form"
          noValidate
          onSubmit={handleSubmit((values) =>
            submitChangementStatut({
              body: { changementStatut: values },
            })
          )}
          width={"50%"}
        >
          <FormControl isInvalid={!!errors.commentaire} isRequired>
            <VisuallyHidden as="label" htmlFor={updateCommentaireChangementStatutId}>Commentaire</VisuallyHidden>
            <Textarea
              id={updateCommentaireChangementStatutId}
              {...register("commentaire", {
                required: false,
              })}
              isDisabled={isSubmitting}
              placeholder="Observation"
              bgColor={"grey.925"}
              rows={8}
            />
          </FormControl>
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
