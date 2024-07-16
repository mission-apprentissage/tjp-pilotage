import { chakra, Tag } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { AvisStatutEnum, AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisTypeEnum, AvisTypeType } from "shared/enum/avisTypeEnum";

const TagIcon = chakra(({ statutAvis }: { statutAvis: AvisStatutType }) => {
  switch (statutAvis) {
    case AvisStatutEnum["favorable"]:
      return <Icon icon={"ri:thumb-up-fill"} />;
    case AvisStatutEnum["défavorable"]:
      return <Icon icon={"ri:thumb-down-fill"} />;
    case AvisStatutEnum["réservé"]:
    default:
      return <></>;
  }
});

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
  }) => {
    const getColor = (statutAvis: AvisStatutType) => {
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

    const getBgColor = (statutAvis: AvisStatutType) => {
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

    return (
      <Tag
        className={className}
        size={size}
        color={getColor(statutAvis)}
        bgColor={getBgColor(statutAvis)}
        gap={1}
      >
        {hasIcon && <TagIcon statutAvis={statutAvis} />}
        {typeAvis &&
          (typeAvis != AvisTypeEnum["final"]
            ? `Avis ${typeAvis} `
            : `Vote ${typeAvis} `)}
        {statutAvis}
      </Tag>
    );
  }
);
