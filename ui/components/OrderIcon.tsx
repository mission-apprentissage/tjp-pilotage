"use client";
import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const OrderIcon = ({ column, orderBy, order }: { column: string; orderBy?: string; order?: "desc" | "asc" }) => {
  if (!order || orderBy !== column) return <ArrowUpDownIcon me={2} color={"bluefrance.113"} />;
  if (order === "desc") {
    return <ChevronDownIcon me={2} mt={"auto"} color={"bluefrance.113"} />;
  }
  return <ChevronUpIcon me={2} mb={"auto"} color={"bluefrance.113"} />;
};
