import React from "react";
import NavLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

const Link = ({ children, href, shallow = false, ...rest }) => {
  return (
    <NavLink href={href} passHref shallow={shallow}>
      <ChakraLink {...rest}>{children}</ChakraLink>
    </NavLink>
  );
};

export default Link;
