import { Badge, chakra, Flex, Tooltip } from "@chakra-ui/react";
import type { TypeFormationSpecifiqueType } from "shared/enum/formationSpecifiqueEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

import { BadgeActionPrioritaire } from "./BadgeActionPrioritaire";
import { BadgeTransitionDemographique } from "./BadgeTransitionDemographique";
import { BadgeTransitionEcologique } from "./BadgeTransitionEcologique";
import { BadgeTransitionNumerique } from "./BadgeTransitionNumerique";
import { TooltipIcon } from "./TooltipIcon";

const BadgeFormationSpecifique = chakra(
  ({
    typeFormationSpecifique,
    withIcon,
    labelSize,
    size,
    textTransform,
    openGlossaire,
    ...props
  }: {
    typeFormationSpecifique: TypeFormationSpecifiqueType;
    withIcon?: boolean;
    labelSize?: "short" | "long";
    size?: "xs" | "sm" | "md";
    textTransform?: "uppercase" | "capitalize" | "lowercase";
    openGlossaire: (key: GlossaireEntryKey) => void;
  }) => {
    switch (typeFormationSpecifique) {
      case TypeFormationSpecifiqueEnum["Action prioritaire"]:
        return (
          <BadgeActionPrioritaire
            isFormationActionPrioritaire
            withIcon={withIcon}
            labelSize={labelSize}
            size={size}
            textTransform={textTransform}
            openGlossaire={openGlossaire}
            {...props}
          />
        );
      case TypeFormationSpecifiqueEnum["Transition écologique"]:
        return (
          <BadgeTransitionEcologique
            isFormationTransitionEcologique
            withIcon={withIcon}
            labelSize={labelSize}
            size={size}
            textTransform={textTransform}
            openGlossaire={openGlossaire}
            {...props}
          />
        );
      case TypeFormationSpecifiqueEnum["Transition démographique"]:
        return (
          <BadgeTransitionDemographique
            isFormationTransitionDemographique
            withIcon={withIcon}
            labelSize={labelSize}
            size={size}
            textTransform={textTransform}
            openGlossaire={openGlossaire}
            {...props}
          />
        );
      case TypeFormationSpecifiqueEnum["Transition numérique"]:
        return (
          <BadgeTransitionNumerique
            isFormationTransitionNumerique
            withIcon={withIcon}
            labelSize={labelSize}
            size={size}
            textTransform={textTransform}
            openGlossaire={openGlossaire}
            {...props}
          />
        );
      default:
        return null;
    }
  }
);

export const BadgesFormationSpecifique = chakra(
  ({
    formationSpecifique,
    withIcon = false,
    labelSize = "long",
    size = "xs",
    textTransform = "uppercase",
    ...props
  }: {
    formationSpecifique?: {
      [key in TypeFormationSpecifiqueType]?: boolean;
    };
    withIcon?: boolean;
    labelSize?: "short" | "long";
    size?: "xs" | "sm" | "md";
    textTransform?: "uppercase" | "capitalize" | "lowercase";
  }) => {
    const { openGlossaire } = useGlossaireContext();
    if (!formationSpecifique) return <></>;

    const formationSpecifiqueKeys = Object.keys(formationSpecifique ?? {}).filter(
      (key) => formationSpecifique[key as TypeFormationSpecifiqueType]
    ) as TypeFormationSpecifiqueType[];

    return (
      <Flex gap={2} flexWrap={"wrap"}>
        {formationSpecifiqueKeys.slice(0, 2).map((typeFormationSpecifique) => (
          <BadgeFormationSpecifique
            key={typeFormationSpecifique}
            typeFormationSpecifique={typeFormationSpecifique}
            withIcon={withIcon}
            labelSize={labelSize}
            size={size}
            textTransform={textTransform}
            openGlossaire={openGlossaire}
            {...props}
          />
        ))}
        {formationSpecifiqueKeys.length === 3 && (
          <Tooltip label={formationSpecifiqueKeys[2]}>
            <Badge>+1</Badge>
          </Tooltip>
        )}
        {formationSpecifiqueKeys.length === 4 && (
          <Tooltip label={`${formationSpecifiqueKeys[2]} et ${formationSpecifiqueKeys[3]}`}>
            <Badge>+2</Badge>
          </Tooltip>
        )}
      </Flex>
    );
  }
);
