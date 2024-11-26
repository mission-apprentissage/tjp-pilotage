import { Image } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { isValidUrl } from "shared/utils/isValidUrl";

import { isEmoji } from "@/utils/isEmoji";

export const GlossaireIcon = ({
  icon,
  size = "24px",
  marginRight = "8px",
}: {
  icon: string;
  size?: string;
  marginRight?: string;
}) => {
  if (isValidUrl(icon)) {
    return <Image boxSize={size} objectFit="cover" src={icon} alt="Icon du glossaire" marginRight={marginRight} />;
  }

  if (isEmoji(icon)) {
    return (
      <span
        style={{
          height: size,
          width: size,
          marginRight,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {icon}
      </span>
    );
  }

  return <Icon icon={icon} height={size} width={size} style={{ marginRight }} />;
};
