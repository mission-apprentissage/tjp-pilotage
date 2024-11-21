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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { passwordRegex } from "shared/utils/passwordRegex";

import { client } from "@/api.client";

export const ActivateAccountForm = ({ activationToken }: { activationToken: string }) => {
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
  } = useMutation({
    mutationFn: handleSubmit(async (values) => {
      await client.ref("[POST]/auth/activate").query({ body: { ...values, activationToken } });
      router.replace("/auth/activer-compte/confirmation");
    }),
  });

  return (
    <Card boxShadow="md" maxW="360px" mt="20" mx="auto">
      <CardBody p="6" as="form" onSubmit={activateAccount}>
        <Heading fontWeight="light" mb="6" textAlign="center" fontSize="2xl">
          Activation du compte
        </Heading>
        <Text mb="6">Pour activer votre compte, veuillez choisir un mot de passe.</Text>
        <FormControl mb="4" isInvalid={!!errors.password}>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            {...register("password", {
              required: "Veuillez saisir un mot de passe",
              pattern: {
                value: new RegExp(passwordRegex),
                message:
                  "Le mot de passe doit contenir entre 8 et 15 caractères, une lettre en minuscule, une lettre en majuscule, un chiffre et un caractère spécial (les espaces ne sont pas acceptés)",
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
            Erreur lors de l'activation du compte
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
