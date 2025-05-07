import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra,Flex, Text, Tooltip} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeTransitionEcologique = chakra(({
  isFormationTransitionEcologique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
  openGlossaire,
  ...props
}: {
  isFormationTransitionEcologique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
  openGlossaire?: (key: GlossaireEntryKey) => void;
  props?: BadgeProps;
}) => {
  if (!isFormationTransitionEcologique) return <></>;
  if (!openGlossaire)
    return (
      <Badge gap={1} size={size} my={"auto"} bgColor={"success.950"} color={"success.425"} {...props}>
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        <Text textTransform={textTransform}>
          {labelSize === "short" ? "Éco" : TypeFormationSpecifiqueEnum["Transition écologique"]}
        </Text>
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        size={size}
        my={"auto"}
        bgColor={"success.950"}
        color={"success.425"}
        cursor={"pointer"}
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
        <Text textTransform={textTransform}>
          {labelSize === "short" ? "Éco" : TypeFormationSpecifiqueEnum["Transition écologique"]}
        </Text>
      </Badge>
    </Tooltip>
  );
});
