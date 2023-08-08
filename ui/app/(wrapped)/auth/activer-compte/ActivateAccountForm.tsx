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
import { useForm } from "react-hook-form";

import { passwordRegex } from "../../../../../shared/utils/passwordRegex";
import { api } from "../../../../api.client";

export const ActivateAccountForm = ({
  activationToken,
}: {
  activationToken: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", repeatPassword: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    await api.setUserPassword({ body: { ...values, activationToken } }).call();
  });

  return (
    <Card maxW="360px" mt="32" mx="auto">
      <CardBody as="form" onSubmit={onSubmit}>
        <Heading mb="4" textAlign="center" fontSize="2xl">
          Activation du compte
        </Heading>
        <Text mb="4">
          Pour activer votre compte, veuillez choisir un mot de passe.
        </Text>
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
          {!!errors.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
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
          {!!errors.repeatPassword && (
            <FormErrorMessage>{errors.repeatPassword.message}</FormErrorMessage>
          )}
        </FormControl>
        <Flex>
          <Button type="submit" mt="4" ml="auto" variant="primary">
            Envoyer
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};
