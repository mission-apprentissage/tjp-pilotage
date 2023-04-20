"use client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

export const LoadingContent = ({
  offset = 200,
  time = 50,
  children,
}: {
  offset?: number;
  time?: number;
  children: ReactNode;
}) => {
  const [load, setLoad] = useState("hide");
  useEffect(() => {
    setTimeout(() => setLoad("load"), offset);
    setTimeout(() => setLoad("visible"), offset + time);
  }, []);
  return (
    <Box position="relative">
      {load !== "visible" && (
        <Center height="60px" width={"100%"} top={0} left={0} bg="white">
          <Spinner />
        </Center>
      )}
      {load !== "hide" && <Box hidden={load === "load"}>{children}</Box>}
    </Box>
  );
};
