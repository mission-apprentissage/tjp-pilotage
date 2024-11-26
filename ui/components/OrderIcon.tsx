"use client";
import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const OrderIcon = ({ column, orderBy, order }: { column: string; orderBy?: string; order?: "desc" | "asc" }) => {
  if (!order || orderBy !== column) return <ArrowUpDownIcon mr={2} />;
  if (order === "desc") {
    return <ChevronDownIcon ml={2} />;
  }
  return <ChevronUpIcon ml={2} />;
};
