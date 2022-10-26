import React from "react";
import NavLink from "next/link";
import { MenuItem as ChakraMenuItem } from "@chakra-ui/react";

const MenuItem = ({ children, href, ...rest }) => {
  return (
    <NavLink href={href} passHref>
      <ChakraMenuItem {...rest}>{children}</ChakraMenuItem>
    </NavLink>
  );
};

export default MenuItem;
