"use client";
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

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

  const { mutateAsync: login, isLoading } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login({ body: { email, password } }).call(),
  });

  const { setAuth, auth } = useContext(AuthContext);

  const onSubmit = handleSubmit(async (values) => {
    await login(values);
    const { user } = await api.whoAmI({}).call();
    setAuth({ user });
  });

  const router = useRouter();

  useEffect(() => {
    if (auth) router.replace("/");
  }, [auth]);

  return (
    <Card maxW="360px" mt="32" width="100%" mx="auto">
      <CardBody as="form" onSubmit={onSubmit}>
        <Heading mb="4" textAlign="center" fontSize="2xl">
          Connexion
        </Heading>
        <FormControl mb="4" isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input {...register("email", { required: true })} />
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            {...register("password", { required: true })}
          />
        </FormControl>
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
  );
};
