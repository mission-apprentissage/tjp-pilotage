import { Badge, Flex, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeTransitionEcologique = ({
  isFormationTransitionEcologique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
  openGlossaire,
}: {
  isFormationTransitionEcologique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
  openGlossaire?: (key: GlossaireEntryKey) => void;
}) => {
  if (!isFormationTransitionEcologique) return <></>;
  if (!openGlossaire)
    return (
      <Badge gap={1} size={size} my={"auto"} bgColor={"success.950"} color={"success.425"}>
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
};
