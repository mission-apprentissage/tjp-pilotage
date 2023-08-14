"use client";
import {
  Box,
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
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { emailRegex } from "shared";

import { api } from "../../../../api.client";
import { AuthContext } from "../authContext";

export const ForgottenPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const router = useRouter();

  const {
    mutateAsync: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: handleSubmit(async ({ email }: { email: string }) => {
      await api.sendResetPassword({ body: { email } }).call();
      router.replace("/auth/mot-de-passe-oublie/confirmation");
    }),
  });
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth) router.replace("/");
  }, [auth]);

  return (
    <Box flex="1">
      <Card boxShadow="md" maxW="360px" mt="20" width="100%" mx="auto">
        <CardBody p="6" as="form" onSubmit={login}>
          <Heading fontWeight="light" mb="6" textAlign="center" fontSize="2xl">
            Mot de passe oublié
          </Heading>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email", {
                required: "Veuillez saisir votre email",
                pattern: {
                  value: new RegExp(emailRegex),
                  message: "L'adresse email doit être valide",
                },
              })}
            />
            {!!errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          {isError && (
            <Text fontSize="sm" mt="4" textAlign="center" color="red.500">
              Erreur lors de la demande
            </Text>
          )}
          <Flex>
            <Button
              isLoading={isLoading}
              type="submit"
              mt="4"
              ml="auto"
              variant="primary"
            >
              Envoyer
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};
