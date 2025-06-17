import type { BadgeProps } from "@chakra-ui/react";
import {Badge, chakra, Flex} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

import { formatTypeDemandeArray} from '@/utils/formatLibelle';
import {getTypeDemandeColor} from '@/utils/getTypeDemandeColor';

const IconTypeDemande = ({typeDemande}:{typeDemande: TypeDemandeType}) => {
  const iconMap: Record<string, string> = {
    [DemandeTypeEnum["transfert"]]: "ri:arrow-left-right-fill",
    [DemandeTypeEnum["coloration"]]: "ri:palette-line",
    [DemandeTypeEnum["ajustement"]]: "ri:arrow-up-down-fill",
    [DemandeTypeEnum["augmentation_nette"]]: "ri:arrow-up-fill",
    [DemandeTypeEnum["augmentation_compensation"]]: "ri:arrow-up-fill",
    [DemandeTypeEnum["ouverture_nette"]]: "ri:arrow-right-fill",
    [DemandeTypeEnum["ouverture_compensation"]]: "ri:arrow-right-fill",
    [DemandeTypeEnum["fermeture"]]: "ri:stop-fill",
    [DemandeTypeEnum["diminution"]]: "ri:arrow-down-fill",
  };

  return <Icon icon={iconMap[typeDemande]} width={16} height={16} />;
};


export const BadgeTypeDemande = chakra(({
  typeDemande,
  size = "md",
  ...props
}: {
  typeDemande?: string;
  size?: "xs" | "sm" | "md" | "lg";
  props?: BadgeProps;
}) => {
  if (!typeDemande) {
    return null;
  }

  return (
    <Flex direction ={"row"} alignItems={"center"} gap={2}>
      {
        formatTypeDemandeArray(typeDemande).map((formatedTypeDemande, index) => (
          <Badge
            key={`${formatedTypeDemande}_${index}`}
            bgColor={getTypeDemandeColor(formatedTypeDemande.value)}
            color={"white"}
            h={"fit-content"}
            flex={"shrink"}
            size={size}
            my={"auto"}
            gap={2}
            {...props}
          >
            <IconTypeDemande typeDemande={formatedTypeDemande.value} />
            {formatedTypeDemande.label}
          </Badge>
        ))
      }
    </Flex>
  );
});
