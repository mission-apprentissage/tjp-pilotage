import { Center, chakra, Spinner } from "@chakra-ui/react";

export const Loading = chakra(({ size, className }: { size?: string; className?: string }) => (
  <Center mt={4}>
    <Spinner className={className} size={size}></Spinner>
  </Center>
));
