import { VStack } from "@chakra-ui/react";
import React from "react";

import AlertPerdir from "./components/AlertPerdir";
import ErrorSSO from "./components/ErrorSSO";
import { LoginForm } from "./LoginForm";

const ERROR_TYPE = "echec_dne_redirect";

const LoginPage = ({ searchParams }: { params: object; searchParams: { error?: string } }) => {
  return (
    <VStack spacing="16px" py="16px">
      {searchParams.error === ERROR_TYPE && <ErrorSSO />}
      <LoginForm />
      {searchParams.error !== ERROR_TYPE && <AlertPerdir />}
    </VStack>
  );
};

export default LoginPage;
