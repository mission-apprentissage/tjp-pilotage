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
  Link,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { emailRegex } from "shared";

import { api } from "../../../../api.client";
import { AuthContext } from "../authContext";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const {
    mutateAsync: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: handleSubmit(
      async ({ email, password }: { email: string; password: string }) => {
        await api.login({ body: { email, password } }).call();
        const { user } = await api.whoAmI({}).call();
        setAuth({ user });
      }
    ),
  });

  const { setAuth, auth } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (auth) router.replace("/");
  }, [auth]);

  return (
    <Box maxW="360px" mt="20" width="100%" mx="auto">
      <Card boxShadow="md">
        <CardBody p="6" as="form" onSubmit={login}>
          <Heading fontWeight="light" mb="6" textAlign="center" fontSize="2xl">
            Connexion
          </Heading>
          <FormControl mb="4" isInvalid={!!errors.email}>
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
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: "Veuillez saisir votre mot de passe",
              })}
            />
            {!!errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          {isError && (
            <Text fontSize="sm" mt="4" textAlign="center" color="red.500">
              Identifiants incorrects
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
      <Text mt="4" textAlign="center">
        <Link as={NextLink} href="/auth/mot-de-passe-oublie">
          Mot de passe oublié
        </Link>
      </Text>
    </Box>
  );
};
