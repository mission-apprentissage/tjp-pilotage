import { Text } from "@chakra-ui/react";
import * as React from "react";

export const DSFRParagraph = (props: React.ComponentProps<typeof Text>) => (
  <Text fontSize={16} {...props}>{props.children}</Text>
);
