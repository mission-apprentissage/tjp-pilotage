import type { BadgeProps } from "@chakra-ui/react";
import { Badge, Flex, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeActionPrioritaire = ({
  isFormationActionPrioritaire = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  openGlossaire,
  ...props
}: {
  isFormationActionPrioritaire?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md" | "lg";
  openGlossaire?: (key: GlossaireEntryKey) => void;
  props?: BadgeProps;
}) => {
  if (!isFormationActionPrioritaire) return <></>;
  if (!openGlossaire)
    return (
      <Badge
        gap={1}
        my={"auto"}
        size={size}
        bgColor={"yellowTournesol.950"}
        color={"yellowTournesol.407"}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Prio" : TypeFormationSpecifiqueEnum["Action prioritaire"]}
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        my={"auto"}
        size={size}
        bgColor={"yellowTournesol.950"}
        color={"yellowTournesol.407"}
        cursor={"pointer"}
        onClick={(e) => {
          e.stopPropagation();
          openGlossaire("action-prioritaire");
        }}
        {...props}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        {labelSize === "short" ? "Prio" : TypeFormationSpecifiqueEnum["Action prioritaire"]}
      </Badge>
    </Tooltip>
  );
};
