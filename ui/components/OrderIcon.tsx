"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const OrderIcon = ({
  column,
  order,
}: {
  column: string;
  order?: {
    orderBy: string;
    order: "desc" | "asc";
  };
}) => {
  if (!order || order.orderBy !== column) return null;
  if (order.order === "desc") {
    return <ChevronDownIcon />;
  }
  return <ChevronUpIcon />;
};
