import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra,Flex, Tooltip} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeTransitionDemographique = chakra(({
  isFormationTransitionDemographique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  openGlossaire,
  ...props
}: {
  isFormationTransitionDemographique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md" | "lg";
  openGlossaire?: (key: GlossaireEntryKey) => void;
  props?: BadgeProps;
}) => {
  if (!isFormationTransitionDemographique) return <></>;
  if (!openGlossaire)
    return (
      <Badge
        gap={1}
        my={"auto"}
        bgColor={"grey.1000_active"}
        color={"grey.425"}
        size={size}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Démo" : TypeFormationSpecifiqueEnum["Transition démographique"]}
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        my={"auto"}
        bgColor={"grey.1000_active"}
        color={"grey.425"}
        cursor={"pointer"}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          openGlossaire("transition-demographique");
        }}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Démo" : TypeFormationSpecifiqueEnum["Transition démographique"]}
      </Badge>
    </Tooltip>
  );
});
