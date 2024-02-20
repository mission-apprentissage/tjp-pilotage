import { VStack } from "@chakra-ui/react";

import AlertPerdir from "./components/AlertPerdir";
import { LoginForm } from "./LoginForm";

export default function () {
  return (
    <VStack spacing="16px" paddingBottom="16px">
      <LoginForm />
      <AlertPerdir />
    </VStack>
  );
}
