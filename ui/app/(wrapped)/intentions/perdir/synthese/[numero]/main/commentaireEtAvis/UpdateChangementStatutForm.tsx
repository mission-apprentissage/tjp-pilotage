import { CheckIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, FormControl, Textarea } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { FormProvider, useForm } from "react-hook-form";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";

type ChangementStatutForm = {
  id: string;
  createdBy: string;
  intentionNumero: string;
  statutPrecedent?: Exclude<DemandeStatutType, "supprimée">;
  statut: Exclude<DemandeStatutType, "supprimée">;
  commentaire?: string;
};

export const UpdateChangementStatutForm = chakra(
  ({
    changementStatut,
    setIsModifying,
    onToggleUpdateChangementStatut,
  }: {
    changementStatut: ChangementStatutForm;
    setIsModifying: (value: boolean) => void;
    onToggleUpdateChangementStatut: () => void;
  }) => {
    const queryClient = useQueryClient();

    const form = useForm<ChangementStatutForm>({
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
      .ref("[POST]/intention/statut/submit")
      .useMutation({
        onSuccess: (_body) => {
          queryClient.invalidateQueries(["[GET]/intention/:numero"]);
          setIsModifying(false);
          onToggleUpdateChangementStatut();
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
          gap={2}
          as="form"
          noValidate
          onSubmit={handleSubmit((values) =>
            submitChangementStatut({
              body: { changementStatut: values },
            }),
          )}
          width={"50%"}
        >
          <FormControl isInvalid={!!errors.commentaire} isRequired>
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
          <Button
            isLoading={isSubmitting}
            variant="primary"
            onClick={handleSubmit((values) =>
              submitChangementStatut({
                body: {
                  changementStatut: values,
                },
              }),
            )}
            leftIcon={<CheckIcon />}
            width={"100%"}
          >
            Enregistrer
          </Button>
        </Flex>
      </FormProvider>
    );
  },
);
