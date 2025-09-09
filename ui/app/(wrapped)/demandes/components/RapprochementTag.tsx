import {Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { getRapprochementMotif } from "shared/utils/getRapprochementMotif";

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

export const RapprochementTag = ({
  rapprochement,
  motifRapprochement,
}: {
  rapprochement: string;
  motifRapprochement: string;
}) => {

  const { label, color } = rapprochementList[rapprochement as RapprochementValue];

  if(rapprochement === "-"){

    //icône gris en timeline
    if(motifRapprochement === getRapprochementMotif("apprentissage") || motifRapprochement === getRapprochementMotif("rentrée")){
      return pastilleColoree(label, color, "bx:time", "#bcbcbc");

    //icône gris en warning
    } else if(motifRapprochement === getRapprochementMotif("statut")){
      return pastilleColoree(label, color, "ri:error-warning-line", "#bcbcbc");


    //icône vert en warning
    } else if(motifRapprochement === getRapprochementMotif("fermeture")){
      return pastilleColoree(label, "#6FE49D", "ri:error-warning-line", "#58b77d");

    //pastille colorée
    }else{
      return pastilleColoree(label, color);

    }

  //pastille colorée
  } else {

    return pastilleColoree(label, color);

  }
};


const pastilleColoree = (label: string, color: string, icon?: string, iconColor?: string) => {
  return (
    <Flex align="center" gap={2}>
      <Flex
        borderRadius="full"
        boxSize="16px"
        bgColor={color}
        flexShrink={0}
        align="center"
        justify="center"
      >
        {icon && iconColor && <Icon icon={icon} width="16" height="16" color={iconColor} />}
      </Flex>
      <Text fontWeight="medium">{label}</Text>
    </Flex>
  );
};
