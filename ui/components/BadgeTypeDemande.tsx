import type { BadgeProps } from "@chakra-ui/react";
import { Badge, chakra, Flex, Text,Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

import { formatTypeDemandeArray } from "@/utils/formatLibelle";
import { getTypeDemandeBgColor, getTypeDemandeTextColor } from "@/utils/getTypeDemandeColor";


const IconTypeDemande = ({typeDemande}:{typeDemande: TypeDemandeType}) => {
  const iconMap: Record<string, string> = {
    [DemandeTypeEnum["transfert"]]: "ri:arrow-left-right-fill",
    [DemandeTypeEnum["coloration"]]: "ri:palette-line",
    [DemandeTypeEnum["ajustement"]]: "ri:arrow-up-down-fill",
    [DemandeTypeEnum["augmentation_nette"]]: "ri:arrow-up-fill",
    [DemandeTypeEnum["augmentation_compensation"]]: "ri:arrow-up-fill",
    [DemandeTypeEnum["ouverture_nette"]]: "ri:arrow-right-fill",
    [DemandeTypeEnum["ouverture_compensation"]]: "ri:arrow-right-fill",
    [DemandeTypeEnum["fermeture"]]: "ri:stop-fill",
    [DemandeTypeEnum["diminution"]]: "ri:arrow-down-fill",
  };

  return <Icon icon={iconMap[typeDemande]} width={16} height={16} />;
};

const getTypeDemandeTooltipLabel = ({
  typeDemande,
  dateEffetTransformation,
  rentreeScolaire
}:{
  typeDemande: TypeDemandeType;
   dateEffetTransformation: string;
   rentreeScolaire: string
}): ReactNode => {
  const labelMap: Record<string, ReactNode> = {
    [DemandeTypeEnum["transfert"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `Cette formation a fait l'objet d'un transfert lors de la campagne de saisie ${rentreeScolaire}.
              Le transfert prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["coloration"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `Cette formation a été colorée lors de la campagne de saisie ${rentreeScolaire}.
              La coloration prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["ajustement"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `Cette formation a fait l'objet d'un ajustement lors de la campagne de saisie ${rentreeScolaire}.
              L'ajustement prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["augmentation_compensation"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `La capacité d’accueil de cette formation a été augmentée lors de la campagne de saisie ${rentreeScolaire}.
              L'augmentation prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["augmentation_nette"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `La capacité d’accueil de cette formation a été augmentée lors de la campagne de saisie ${rentreeScolaire}.
              L'augmentation prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["ouverture_nette"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `Cette formation a été ouverte lors de la campagne de saisie ${rentreeScolaire}.
              L'ouverture prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["ouverture_compensation"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `Cette formation a été ouverte lors de la campagne de saisie ${rentreeScolaire}.
              L'ouverture prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["fermeture"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `Cette formation a été fermée lors de la campagne de saisie ${rentreeScolaire}.
              La fermeture prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      ),
    [DemandeTypeEnum["diminution"]]:
      (
        <Flex direction="column" gap={4}>
          <Text>
            {
              `La capacité d’accueil de cette formation a été diminuée lors de la campagne de saisie ${rentreeScolaire}.
              La diminution prendra effet à la rentrée scolaire ${dateEffetTransformation}.`
            }
          </Text>
          <Text fontWeight={700}> Cliquez pour consulter le détail de la demande.</Text>
        </Flex>
      )
  };

  return labelMap[typeDemande] || <></>;
};


export const BadgeTypeDemande = chakra(({
  typeDemande,
  numero,
  dateEffetTransformation,
  rentreeScolaire,
  size = "md",
  ...props
}: {
  typeDemande?: string;
  numero?: string;
  dateEffetTransformation?: string;
  rentreeScolaire?: string;
  size?: "xs" | "sm" | "md" | "lg";
  props?: BadgeProps;
}) => {
  if (!typeDemande || !numero || !dateEffetTransformation || !rentreeScolaire) return null;

  const numeroArray = numero.split(", ");
  const dateEffetTransformationArray = dateEffetTransformation.split(", ");

  return (
    <Flex direction ={"row"} alignItems={"center"} gap={2}>
      {
        formatTypeDemandeArray(typeDemande).map((formatedTypeDemande, index) => (
          <Tooltip
            key={`${formatedTypeDemande}_${index}`}
            label={getTypeDemandeTooltipLabel({
              typeDemande: formatedTypeDemande.value,
              dateEffetTransformation: dateEffetTransformationArray[index],
              rentreeScolaire
            })}>
            <Badge
              as={NextLink}
              href={`/demandes/synthese/${numeroArray[index]}`}
              target="_blank"
              bgColor={getTypeDemandeBgColor(formatedTypeDemande.value)}
              color={getTypeDemandeTextColor(formatedTypeDemande.value)}
              h={"fit-content"}
              flex={"shrink"}
              size={size}
              my={"auto"}
              gap={2}
              {...props}
            >
              <IconTypeDemande typeDemande={formatedTypeDemande.value} />
              {formatedTypeDemande.label}
            </Badge>
          </Tooltip>
        ))
      }
    </Flex>
  );
});
