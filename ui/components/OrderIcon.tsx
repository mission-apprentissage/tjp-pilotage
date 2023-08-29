"use client";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";

export const OrderIcon = ({
  column,
  orderBy,
  order,
}: {
  column: string;
  orderBy?: string;
  order?: "desc" | "asc";
}) => {
  if (!order || orderBy !== column) return <ArrowUpDownIcon mx={2} />;
  if (order === "desc") {
    return <ChevronDownIcon mx={2} />;
  }
  return <ChevronUpIcon mx={2} />;
};
