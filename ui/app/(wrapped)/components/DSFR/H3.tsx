import { Heading } from "@chakra-ui/react";

export const DSFRH3 = (props: React.ComponentProps<typeof Heading>) => (
  <Heading as="h3" mb="8px" fontSize={28} {...props}>{props.children}</Heading>
);
