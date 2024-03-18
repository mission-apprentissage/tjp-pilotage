import { VStack } from "@chakra-ui/react";
import { ERROR_TYPE } from "server/src/modules/core/usecases/redirectDne/const";

import AlertPerdir from "./components/AlertPerdir";
import ErrorSSO from "./components/ErrorSSO";
import { LoginForm } from "./LoginForm";

export default function ({
  searchParams,
}: {
  params: object;
  searchParams: { error?: string };
}) {
  return (
    <VStack spacing="16px" py="16px">
      {searchParams.error === ERROR_TYPE && <ErrorSSO />}
      <LoginForm />
      {searchParams.error !== ERROR_TYPE && <AlertPerdir />}
    </VStack>
  );
}
