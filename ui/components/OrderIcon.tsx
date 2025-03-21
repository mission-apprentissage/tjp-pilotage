"use client";
import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const OrderIcon = ({ colonne, orderBy, order }: { colonne: string; orderBy?: string; order?: "desc" | "asc" }) => {
  if (!order || orderBy !== colonne) return <ArrowUpDownIcon mr={2} />;
  if (order === "desc") {
    return <ChevronDownIcon mr={1} boxSize={5} />;
  }
  return <ChevronUpIcon mr={1} boxSize={5}/>;
};
