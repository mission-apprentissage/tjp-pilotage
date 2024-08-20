import { Center, chakra, Spinner } from "@chakra-ui/react";

export const CorrectionSpinner = chakra(
  ({ className }: { className?: string }) => {
    return (
      <Center className={className} mt="12">
        <Spinner size="xl" />
      </Center>
    );
  }
);
