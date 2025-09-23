import { useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

export const GlossaireIcon = ({
  icon,
  size = "24px",
  marginRight = "8px",
  color = "bluefrance.113",
}: {
  icon: string;
  size?: string;
  marginRight?: string;
  color?: string;
}) => {
  const [iconColor] = useToken("colors", [color]);
  return <Icon icon={icon} height={size} width={size} style={{ marginRight }} color={iconColor} />;
};
