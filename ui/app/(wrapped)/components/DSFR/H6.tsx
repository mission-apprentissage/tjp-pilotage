import { Heading } from "@chakra-ui/react";

export const DSFRH6 = (props: React.ComponentProps<typeof Heading>) => (
  <Heading as="h6" mb="8px" fontSize={20} {...props}>{props.children}</Heading>
);
