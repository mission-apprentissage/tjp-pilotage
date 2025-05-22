import type { BadgeProps} from "@chakra-ui/react";
import { Badge, Flex, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeActionPrioritaire = ({
  isFormationActionPrioritaire = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
  openGlossaire,
  ...props
}: {
  isFormationActionPrioritaire?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
  openGlossaire?: (key: GlossaireEntryKey) => void;
  props?: BadgeProps;
}) => {
  if (!isFormationActionPrioritaire) return <></>;
  if (!openGlossaire)
    return (
      <Badge gap={1} size={size} my={"auto"} bgColor={"yellowTournesol.950"} color={"yellowTournesol.407"} {...props}>
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        <Text textTransform={textTransform}>
          {labelSize === "short" ? "Prio" : TypeFormationSpecifiqueEnum["Action prioritaire"]}
        </Text>
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        size={size}
        my={"auto"}
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
        <Text textTransform={textTransform}>
          {labelSize === "short" ? "Prio" : TypeFormationSpecifiqueEnum["Action prioritaire"]}
        </Text>
      </Badge>
    </Tooltip>
  );
};
