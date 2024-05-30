import { Button, ButtonProps } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

interface Props extends ButtonProps {
  children: ReactNode;
}

export const LinkButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, ...props }, ref) => (
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
  )
);
