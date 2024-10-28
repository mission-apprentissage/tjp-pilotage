"use client";
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { passwordRegex } from "shared/utils/passwordRegex";

import { client } from "@/api.client";

export const ResetPasswordForm = ({ resetPasswordToken }: { resetPasswordToken: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", repeatPassword: "" },
    mode: "onTouched",
  });

  const router = useRouter();

  const {
    mutate: activateAccount,
    isError,
    isLoading,
  } = client.ref("[POST]/auth/reset-password").useMutation({
    onSuccess: () => {
      router.replace("/auth/reset-password/confirmation");
    },
  });

  return (
    <Card boxShadow="md" maxW="360px" mt="20" mx="auto">
      <CardBody p="6" as="form" onSubmit={handleSubmit((v) => activateAccount({ body: { ...v, resetPasswordToken } }))}>
        <Heading fontWeight="light" mb="6" textAlign="center" fontSize="2xl">
          Réinitialisation du mot de passe
        </Heading>
        <FormControl mb="4" isInvalid={!!errors.password}>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            {...register("password", {
              required: "Veuillez saisir un mot de passe",
              pattern: {
                value: new RegExp(passwordRegex),
                message:
                  "Le mot de passe doit contenir au moins 8 caractères, une lettre en minuscule, une lettre en majuscule, un chiffre et un caractère spécial (les espaces ne sont pas acceptés)",
              },
            })}
          />
          {!!errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.repeatPassword}>
          <FormLabel>Confirmer le mot de passe</FormLabel>
          <Input
            type="password"
            {...register("repeatPassword", {
              required: true,
              validate: (value, values) => {
                if (value !== values.password) {
                  return "Les mots de passe doivent être identiques";
                }
              },
            })}
          />
          {!!errors.repeatPassword && <FormErrorMessage>{errors.repeatPassword.message}</FormErrorMessage>}
        </FormControl>
        {isError && (
          <Text fontSize="sm" mt="4" textAlign="center" color="red.500">
            Erreur lors de la réinitialisation du mot de passe
          </Text>
        )}
        <Flex>
          <Button isLoading={isLoading} type="submit" mt="4" ml="auto" variant="primary">
            Envoyer
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};
