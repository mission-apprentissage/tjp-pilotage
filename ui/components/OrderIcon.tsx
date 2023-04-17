"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const OrderIcon = ({
  column,
  orderBy,
  order,
}: {
  column: string;
  orderBy?: string;
  order?: "desc" | "asc";
}) => {
  if (!order || orderBy !== column) return null;
  if (order === "desc") {
    return <ChevronDownIcon />;
  }
  return <ChevronUpIcon />;
};
