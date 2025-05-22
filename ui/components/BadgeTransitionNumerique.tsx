import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra,Flex, Tooltip} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeTransitionNumerique = chakra(({
  isFormationTransitionNumerique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  openGlossaire,
  ...props
}: {
  isFormationTransitionNumerique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size: "xs" | "sm" | "md" | "lg";
  openGlossaire?: (key: GlossaireEntryKey) => void;
  props?: BadgeProps;
}) => {
  if (!isFormationTransitionNumerique) return <></>;
  if (!openGlossaire)
    return (
      <Badge
        gap={1}
        my={"auto"}
        bgColor={"bluefrance.925"}
        color={"bluefrance.113"}
        size={size}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Num" : TypeFormationSpecifiqueEnum["Transition numérique"]}
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        my={"auto"}
        bgColor={"bluefrance.925"}
        color={"bluefrance.113"}
        cursor={"pointer"}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          openGlossaire("transition-numerique");
        }}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Num" : TypeFormationSpecifiqueEnum["Transition numérique"]}
      </Badge>
    </Tooltip>
  );
});
