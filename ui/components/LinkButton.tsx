import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { forwardRef } from "react";

interface Props extends ButtonProps {
  children: ReactNode;
}

// eslint-disable-next-line react/display-name
export const LinkButton = forwardRef<HTMLButtonElement, Props>(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    variant={"ghost"}
    borderRadius={"unset"}
    borderBottom={"1px solid"}
    borderColor={"bluefrance.113"}
    color={"bluefrance.113"}
    _hover={{
      backgroundColor: "unset",
    }}
    p={0}
    h="fit-content"
    fontWeight={400}
    fontSize={16}
    {...props}
  >
    {children}
  </Button>
));
