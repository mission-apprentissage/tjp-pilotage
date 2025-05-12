import { VStack } from "@chakra-ui/react";
import type {DneSSOErrorsType} from "shared/enum/dneSSOErrorsEnum";
import { DneSSOErrorsZodType } from "shared/enum/dneSSOErrorsEnum";

import AlertPerdir from "./components/AlertPerdir";
import ErrorSSO from "./components/ErrorSSO";
import { LoginForm } from "./LoginForm";

const LoginPage = ({ searchParams }: { params: object; searchParams: { error?: string } }) => {
  const isErrorKnown = DneSSOErrorsZodType.safeParse(searchParams.error);
  return (
    <VStack spacing="16px" py="16px">
      {isErrorKnown.success && (
        <ErrorSSO errorType={(searchParams.error as DneSSOErrorsType)} />
      )}
      <LoginForm />
      {isErrorKnown.error && (
        <AlertPerdir />
      )}
    </VStack>
  );
};

export default LoginPage;
