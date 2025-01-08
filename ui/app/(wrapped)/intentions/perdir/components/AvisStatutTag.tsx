import { chakra, Tag } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisStatutEnum } from "shared/enum/avisStatutEnum";
import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";

export const TagIcon = chakra(({ statutAvis }: { statutAvis: AvisStatutType }) => {
  switch (statutAvis) {
    case AvisStatutEnum["favorable"]:
      return <Icon icon={"ri:thumb-up-fill"} />;
    case AvisStatutEnum["défavorable"]:
      return <Icon icon={"ri:thumb-down-fill"} />;
    case AvisStatutEnum["réservé"]:
      return <Icon icon={"ri:emotion-normal-fill"} />;
    default:
      return <></>;
  }
});

export const getAvisStatusTagTextColor = (statutAvis: AvisStatutType) => {
  switch (statutAvis) {
    case AvisStatutEnum["réservé"]:
      return "yellowTournesol.407";
    case AvisStatutEnum["favorable"]:
      return "success.425";
    case AvisStatutEnum["défavorable"]:
      return "error.425";
    default:
      return "grey.425";
  }
};

export const getAvisStatusTagBgColor = (statutAvis: AvisStatutType) => {
  switch (statutAvis) {
    case AvisStatutEnum["réservé"]:
      return "yellowTournesol.950";
    case AvisStatutEnum["favorable"]:
      return "success.950";
    case AvisStatutEnum["défavorable"]:
      return "error.950";
    default:
      return "grey.425";
  }
};

export const AvisStatutTag = chakra(
  ({
    statutAvis,
    typeAvis,
    className,
    size = "sm",
    hasIcon = false,
  }: {
    statutAvis: AvisStatutType;
    typeAvis?: AvisTypeType;
    className?: string;
    size?: "sm" | "md" | "lg";
    hasIcon?: boolean;
  }) => (
    <Tag
      className={className}
      size={size}
      color={getAvisStatusTagTextColor(statutAvis)}
      bgColor={getAvisStatusTagBgColor(statutAvis)}
      gap={1}
    >
      {hasIcon && <TagIcon statutAvis={statutAvis} />}
      {typeAvis && (typeAvis != AvisTypeEnum["final"] ? `Avis ${typeAvis} ` : `Vote ${typeAvis} `)}
      {statutAvis}
    </Tag>
  ),
);
