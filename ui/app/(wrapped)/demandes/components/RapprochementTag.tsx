import { Flex, Text } from "@chakra-ui/react";

export type RapprochementValue = "OK" | "KO" | "-";

const rapprochementList: Record<RapprochementValue, { label: string; color: string; tooltip: string }> = {
  OK: {
    label: "OUI",
    color: "#6FE49D",
    tooltip: "Transformation rapprochée avec le constat de rentrée",
  },
  KO: {
    label: "NON",
    color: "#FA7659",
    tooltip: "Le croisement avec le constat de rentrée n'a pas pu se faire. Veuillez vérifier l'établissement (UAI) ou le diplôme (CFD) et apporter les corrections nécessaires pour que le rapprochement s’opère",
  },
  "-": {
    label: "-",
    color: "#DDDDDD",
    tooltip: "Données non disponibles pour faire le croisement avec le constat de rentrée",
  },
};

export const getRapprochementTooltip = (value: RapprochementValue): string =>
  rapprochementList[value].tooltip;

export const getLienRapprochement = (rapprochementOK: string, uai: string, cfd: string, numero: string) => {
  return rapprochementOK === 'OK' ? `/console/etablissements?filters[uai][0]=${uai}&filters[cfd][0]=${cfd}`
    : rapprochementOK === 'KO' ? `/demandes/saisie/${numero}?editCfdUai=true`
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
