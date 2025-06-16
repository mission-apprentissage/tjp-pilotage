import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra,Flex, Tooltip} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeTransitionEcologique = chakra(({
  isFormationTransitionEcologique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  openGlossaire,
  ...props
}: {
  isFormationTransitionEcologique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md" | "lg";
  openGlossaire?: (key: GlossaireEntryKey) => void;
  props?: BadgeProps;
}) => {
  if (!isFormationTransitionEcologique) return <></>;
  if (!openGlossaire)
    return (
      <Badge
        gap={1}
        my={"auto"}
        bgColor={"success.950"}
        color={"success.425"}
        size={size}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Éco" : TypeFormationSpecifiqueEnum["Transition écologique"]}
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        my={"auto"}
        bgColor={"success.950"}
        color={"success.425"}
        cursor={"pointer"}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          openGlossaire("transition-ecologique");
        }}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Éco" : TypeFormationSpecifiqueEnum["Transition écologique"]}
      </Badge>
    </Tooltip>
  );
});
