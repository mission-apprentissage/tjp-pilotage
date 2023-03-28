"use client";
import { Center, Spinner } from "@chakra-ui/react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Center mt={4}>
      <Spinner></Spinner>
    </Center>
  );
}
