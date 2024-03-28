import {
  Badge,
  Box,
  Divider,
  HStack,
  ListItem,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { InlineIcon } from "@iconify/react";
import { useState } from "react";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { client } from "@/api.client";

import { themeDefinition } from "../../../../../../../../../theme/theme";
import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

interface CustomListItemProps {
  etablissement: (typeof client.infer)["[GET]/etablissement/:uai/map/list"]["etablissementsProches"][number];
  withDivider: boolean;
  children?: React.ReactNode;
}

const formatDistance = (distance: number) => {
  return `${Math.round(distance * 10) / 10} km`;
};

const formatDispositifs = (dispositifs: string[]) => {
  return dispositifs
    .filter((libelle) => libelle !== "")
    .map((d) => {
      return d.replace(/\sen\s/i, " ").replace(/professionnel/i, "PRO");
    });
};

const formatPercentage = (percentage: number) => {
  return Math.round(percentage * 100) + "%";
};

const formatSecteur = (secteur: string) => {
  switch (secteur) {
    case "PU":
      return "Public";
    case "PR":
      return "Privé";
    default:
      return "";
  }
};

const formatDepartement = (departement: string) => {
  if (departement.length === 3 && departement[0] === "0") {
    return departement.substring(1);
  }

  return departement;
};

export const CustomListItem = ({
  etablissement,
  withDivider,
  children,
}: CustomListItemProps) => {
  const { hoverUai, setHoverUai, map, activeUai, setActiveUai } =
    useEtablissementMapContext();
  const [hover, setHover] = useState(false);

  const flyToEtablissement = () => {
    if (map !== undefined) {
      setActiveUai(etablissement.uai);
      map.flyTo({
        center: [etablissement.longitude, etablissement.latitude],
      });
    }
  };

  if (!etablissement) return null;

  const backgroundColor = (() => {
    if (activeUai === etablissement.uai) {
      return themeDefinition.colors.grey["1000_active"];
    }
    if (hoverUai === etablissement.uai) {
      return themeDefinition.colors.grey["1000_hover"];
    }
    return "transparent";
  })();

  const isScolaire = etablissement.voies.includes("scolaire");
  const isApprentissage = etablissement.voies.includes("apprentissage");

  const tooltipLabelEffectif = (() => {
    if (etablissement.effectif !== undefined) {
      if (isScolaire && !isApprentissage) {
        return `Effectif ${CURRENT_RENTREE}`;
      }

      if (isScolaire && isApprentissage) {
        return `Effectif ${CURRENT_RENTREE} voie scolaire`;
      }
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return `Données indisponibles`;
  })();

  const tooltipLabelTauxEmploi = (() => {
    if (etablissement.tauxInsertion !== undefined) {
      if (isScolaire) {
        return `Taux d'emploi à 6mois (Millesime ${CURRENT_IJ_MILLESIME.split(
          "_"
        ).join("+")})`;
      }
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return `Données indisponibles`;
  })();

  const tooltipLabelTauxPoursuite = (() => {
    if (etablissement.tauxPoursuite !== undefined) {
      if (isScolaire) {
        return `Taux de poursuite d'étude (Millesime ${CURRENT_IJ_MILLESIME.split(
          "_"
        ).join("+")})`;
      }
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return "Données indisponibles";
  })();

  return (
    <>
      <ListItem
        padding="16px"
        backgroundColor={backgroundColor}
        _hover={{ cursor: "pointer" }}
        onMouseOver={() => setHoverUai(etablissement.uai)}
        onClick={() => flyToEtablissement()}
      >
        <VStack>
          <HStack justifyContent={"space-between"} width="100%">
            <HStack>
              <Text
                fontWeight={700}
                _hover={{ textDecoration: "underline" }}
                onMouseOver={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() =>
                  window.open(
                    `/panorama/etablissement/${etablissement.uai}`,
                    "_blank"
                  )
                }
              >
                {etablissement.libelleEtablissement}
              </Text>
              {hover && <InlineIcon icon="ri:arrow-right-line" />}
            </HStack>
            <HStack flexWrap="wrap" justifyContent="flex-end">
              {formatDispositifs(etablissement.libellesDispositifs).map(
                (libelle) => (
                  <Badge
                    key={`${etablissement.uai}-${libelle}`}
                    variant="neutral"
                  >
                    {libelle}
                  </Badge>
                )
              )}
              {children}
            </HStack>
          </HStack>
          <HStack justifyContent={"space-between"} width="100%">
            <HStack
              fontSize="12px"
              color={themeDefinition.colors.grey[425]}
              divider={<Divider orientation="vertical" h="12px" w="1px" />}
            >
              <Text>
                {etablissement.commune} (
                {formatDepartement(etablissement.codeDepartement)})
              </Text>
              <Text>{formatDistance(etablissement.distance)}</Text>
              {etablissement.secteur && (
                <Text>{formatSecteur(etablissement.secteur)}</Text>
              )}
            </HStack>
          </HStack>
          <HStack width="100%" justifyContent="space-between">
            <HStack width="100%" justifyContent="space-between">
              <HStack gap="8px">
                {etablissement.voies.map((voie) =>
                  voie === "scolaire" ? (
                    <Badge variant="info" key={`${etablissement.uai}-${voie}`}>
                      <Box display="inline" mr="4px">
                        <InlineIcon
                          icon="ri:briefcase-5-line"
                          color={themeDefinition.colors.info.text}
                        />
                      </Box>
                      {voie}
                    </Badge>
                  ) : (
                    <Badge variant="new" key={`${etablissement.uai}-${voie}`}>
                      <Box display="inline" mr="4px">
                        <InlineIcon
                          icon="ri:hotel-line"
                          color={themeDefinition.colors.orange.dark}
                        />
                      </Box>
                      {voie}
                    </Badge>
                  )
                )}
              </HStack>
              <HStack
                gap="8px"
                fontSize="12px"
                divider={<Divider h="12px" w="1px" orientation="vertical" />}
                color={themeDefinition.colors.grey[425]}
              >
                <Tooltip label={tooltipLabelEffectif}>
                  <HStack gap="4px" width="30px">
                    <InlineIcon icon="ri:group-line" />
                    <Text>
                      {etablissement.effectif !== undefined
                        ? etablissement.effectif
                        : "--"}
                    </Text>
                  </HStack>
                </Tooltip>
                <Tooltip label={tooltipLabelTauxEmploi}>
                  <HStack gap="4px" width="40px">
                    <InlineIcon icon="ri:briefcase-line" />
                    <Text>
                      {etablissement.tauxInsertion !== undefined
                        ? formatPercentage(etablissement.tauxInsertion)
                        : "--"}
                    </Text>
                  </HStack>
                </Tooltip>
                <Tooltip label={tooltipLabelTauxPoursuite}>
                  <HStack gap="4px" width="40px">
                    <InlineIcon icon="ri:book-open-line" />
                    <Text>
                      {etablissement.tauxPoursuite !== undefined
                        ? formatPercentage(etablissement.tauxPoursuite)
                        : "--"}
                    </Text>
                  </HStack>
                </Tooltip>
              </HStack>
            </HStack>
          </HStack>
        </VStack>
      </ListItem>
      {withDivider && <Divider />}
    </>
  );
};
