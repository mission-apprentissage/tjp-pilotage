import { Flex, Text } from "@chakra-ui/react";

export type RapprochementValue = "OK" | "KO" | "-";
const rapprochementList: Record<RapprochementValue, { label: string; color: string }> = {
  OK: {
    label: "OUI",
    color: "#6FE49D"
  },
  KO: {
    label: "NON",
    color: "#FA7659"
  },
  "-": {
    label: "-",
    color: "#DDDDDD"
  },
};

export const getLienRapprochement = (rapprochement: string, uai: string, cfd: string, numero: string) => {
  return rapprochement === 'OK' ? `/console/etablissements?filters[uai][0]=${uai}&filters[cfd][0]=${cfd}`
    : rapprochement === 'KO' ? `/demandes/saisie/${numero}?editCfdUai=true`
      : `/demandes/synthese/${numero}`;
};

export const RapprochementTag = ({ value }: { value: string }) => {
  if (!["OK", "KO", "-"].includes(value)) return null;

  const { label, color } = rapprochementList[value as RapprochementValue];

  return (
    <Flex align="center" gap={2}>
      <Flex
        borderRadius="full"
        boxSize="16px"
        bgColor={color}
        flexShrink={0}
      />
      <Text fontWeight="medium">{label}</Text>
    </Flex>
  );
};
