import { Badge, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

export const BadgeTransitionDemographique = ({
  isFormationTransitionDemographique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
}: {
  isFormationTransitionDemographique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
}) => {
  if (!isFormationTransitionDemographique) return <></>;
  return (
    <Badge gap={1} size={size} my={"auto"} bgColor={"grey.1000_active"} color={"grey.425"}>
      {withIcon && (
        <Flex my={"auto"}>
          <Icon icon="ri:file-info-fill" />
        </Flex>
      )}
      <Text textTransform={textTransform}>
        {labelSize === "short" ? "Démo" : TypeFormationSpecifiqueEnum["Transition démographique"]}
      </Text>
    </Badge>
  );
};
