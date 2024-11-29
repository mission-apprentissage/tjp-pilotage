import { Badge, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

export const BadgeTransitionEcologique = ({
  isFormationTransitionEcologique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
}: {
  isFormationTransitionEcologique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
}) => {
  if (!isFormationTransitionEcologique) return <></>;
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
};
