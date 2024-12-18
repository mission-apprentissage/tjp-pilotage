import { Badge, Flex, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const BadgeTransitionNumerique = ({
  isFormationTransitionNumerique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
  openGlossaire,
}: {
  isFormationTransitionNumerique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
  openGlossaire?: (key: GlossaireEntryKey) => void;
}) => {
  if (!isFormationTransitionNumerique) return <></>;
  if (!openGlossaire)
    return (
      <Badge gap={1} size={size} my={"auto"} bgColor={"bluefrance.925"} color={"bluefrance.113"}>
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        <Text textTransform={textTransform}>
          {labelSize === "short" ? "Num" : TypeFormationSpecifiqueEnum["Transition numérique"]}
        </Text>
      </Badge>
    );
  return (
    <Tooltip label="Cliquez pour plus d'infos.">
      <Badge
        gap={1}
        size={size}
        my={"auto"}
        bgColor={"bluefrance.925"}
        color={"bluefrance.113"}
        cursor={"pointer"}
        onClick={(e) => {
          e.stopPropagation();
          openGlossaire("transition-numerique");
        }}
      >
        {withIcon && (
          <Flex my={"auto"}>
            <Icon icon="ri:file-info-fill" />
          </Flex>
        )}
        <Text textTransform={textTransform}>
          {labelSize === "short" ? "Num" : TypeFormationSpecifiqueEnum["Transition numérique"]}
        </Text>
      </Badge>
    </Tooltip>
  );
};
