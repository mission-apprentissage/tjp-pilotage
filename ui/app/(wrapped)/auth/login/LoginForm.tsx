"use client";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { emailRegex } from "shared";

import { client } from "@/api.client";
import { AuthContext } from "@/app/(wrapped)/auth/authContext";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const { data: { url } = {} } = client.ref("[GET]/dne_url").useQuery({});

  const {
    mutateAsync: login,
    isLoading,
    isError,
  } = client.ref("[POST]/auth/login").useMutation({
    onSuccess: async () => {
      const whoAmI = await client.ref("[GET]/auth/whoAmI").query({});
      if (!whoAmI) return;
      setAuth({ user: whoAmI.user });
    },
  });

  const { setAuth, auth } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (auth)
      router.replace(
        auth.user.role === "perdir" && auth.user.uais?.[0] ? `/panorama/etablissement/${auth.user.uais?.[0]}` : "/"
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <Box maxW="360px" width="100%" mx="auto">
      <Card boxShadow="md">
        <CardBody p="6" as="form" onSubmit={handleSubmit(async (v) => login({ body: v }))}>
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
            {!!errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: "Veuillez saisir votre mot de passe",
              })}
            />
            {!!errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>
          {isError && (
            <Text fontSize="sm" mt="4" textAlign="center" color="red.500">
              Identifiants incorrects
            </Text>
          )}
          <Flex>
            <Button isLoading={isLoading} type="submit" mt="4" ml="auto" variant="primary">
              Se connecter
            </Button>
          </Flex>
          {false && (
            <>
              <Divider mt="6" mb="6" />
              <Button width="100%" as={NextLink} href={url ?? "#"}>
                Accéder au portail de l'éducation nationale
              </Button>
            </>
          )}
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
