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
import type { AxiosError } from "axios";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { emailRegex, hasRole, RoleEnum } from "shared";
import { LoginErrorsEnum } from "shared/enum/loginErrorsEnum";
import type { loginSchema } from "shared/routes/schemas/post.auth.login.schema";
import type { z } from "zod";

import { client } from "@/api.client";
import { CodeRegionContext } from "@/app/codeRegionContext";
import { PreviousCampagneContext } from "@/app/previousCampagneContext";
import { UaisContext } from "@/app/uaiContext";
import { publicConfig } from "@/config.public";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

import { LOGIN_ERRORS } from "./const";


export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const { setAuth, user } = useAuth();
  const { setCampagne: setCurrentCampagne } = useCurrentCampagne();
  const { setCampagne: setPreviousCampagne } = useContext(PreviousCampagneContext);
  const { setCodeRegion } = useContext(CodeRegionContext);
  const { setUais } = useContext(UaisContext);
  const { data: { url } = {} } = client.ref("[GET]/dne_url").useQuery({});

  const showConnectToDNEPortal = publicConfig.env !== "production" && url !== undefined;

  const {
    mutateAsync: login,
    isLoading,
    isError,
    error
  } = client.ref("[POST]/auth/login").useMutation({
    onSuccess: async () => {
      const whoAmI = await client.ref("[GET]/auth/whoAmI").query({});
      if (!whoAmI) return;
      setAuth({ user: whoAmI.user });
      setCodeRegion(whoAmI.user.codeRegion);
      setUais(whoAmI.user.uais);
      await client.ref("[GET]/campagne/current").query({}).then((campagne) => {
        setCurrentCampagne(campagne.current);
        setPreviousCampagne(campagne.previous);
      });
    },
  });

  const loginError = useMemo(() => {
    if (!error) return undefined;
    return ((error as AxiosError)?.response?.data as z.infer<typeof loginSchema.response["401"]>).message ?? LoginErrorsEnum.UNKNOWN;
  }, [error]);

  const router = useRouter();

  useEffect(() => {
    if (user)
      router.replace(
        hasRole({ user, role: RoleEnum["perdir"]}) && user.uais?.[0] ? `/panorama/etablissement/${user.uais?.[0]}` : "/"
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
          {isError && loginError && (
            <Text fontSize="sm" mt="4" textAlign="center" color="red.500">
              {LOGIN_ERRORS[loginError].message}
            </Text>
          )}
          <Flex>
            <Button isLoading={isLoading} type="submit" mt="4" ml="auto" variant="primary">
              Se connecter
            </Button>
          </Flex>
          {showConnectToDNEPortal && (
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
