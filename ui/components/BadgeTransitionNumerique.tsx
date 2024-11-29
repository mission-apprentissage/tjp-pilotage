import { Badge, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

export const BadgeTransitionNumerique = ({
  isFormationTransitionNumerique = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
}: {
  isFormationTransitionNumerique?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
}) => {
  if (!isFormationTransitionNumerique) return <></>;
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
};
