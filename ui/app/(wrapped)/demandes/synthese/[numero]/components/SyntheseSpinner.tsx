import { Center, chakra, Spinner } from "@chakra-ui/react";

export const SyntheseSpinner = chakra(({ className }: { className?: string }) => {
  return (
    <Center className={className} mt="12">
      <Spinner size="xl" />
    </Center>
  );
});
