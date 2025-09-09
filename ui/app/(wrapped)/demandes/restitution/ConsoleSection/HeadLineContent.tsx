import { Box, chakra, Flex, IconButton,Text, Th, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { CSSProperties } from "react";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { TooltipDefinitionAMICMA } from "@/app/(wrapped)/components/definitions/DefinitionAMICMA";
import { TooltipDefinitionColoration } from "@/app/(wrapped)/components/definitions/DefinitionColoration";
import { TooltipDefinitionFCIL } from "@/app/(wrapped)/components/definitions/DefinitionFCIL";
import { TooltipDefinitionPositionQuadrant } from "@/app/(wrapped)/components/definitions/DefinitionPositionQuadrant";
import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { DEMANDES_COLUMNS, DEMANDES_COLUMNS_OPTIONAL } from "@/app/(wrapped)/demandes/restitution/DEMANDES_COLUMN";
import type { DEMANDES_COLUMNS_KEYS,FiltersDemandesRestitution, OrderDemandesRestitution } from "@/app/(wrapped)/demandes/restitution/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";

import { COLUMNS_WIDTH } from "./COLUMNS_WIDTH";
import { getLeftOffset, isColonneSticky } from "./utils";

const ConditionalTh = chakra(
  ({
    className,
    style,
    colonneFilters,
    colonne,
    stickyColonnes,
    setStickyColonnes,
    getCellBgColor,
    order,
    handleOrder,
    isNumeric = false,
    overrideLabel,
    overrideTooltip,
    icon
  }: {
    className?: string;
    style?: CSSProperties;
    colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
    colonne: DEMANDES_COLUMNS_KEYS;
    stickyColonnes: Array<DEMANDES_COLUMNS_KEYS>;
    setStickyColonnes: React.Dispatch<React.SetStateAction<DEMANDES_COLUMNS_KEYS[]>>;
    getCellBgColor: (column: DEMANDES_COLUMNS_KEYS) => string;
    order: OrderDemandesRestitution;
    handleOrder?: (column: OrderDemandesRestitution["orderBy"]) => void;
    isNumeric?: boolean;
    overrideLabel?: string;
    overrideTooltip?: (tooltip: string) => string;
    icon?: React.ReactNode;
  }) => {
    const isSticky = isColonneSticky({ colonne, stickyColonnes });

    if (colonneFilters.includes(colonne))
      return (
        <Th
          p={2}
          className={className}
          style={style}
          isNumeric={isNumeric}
          cursor={handleOrder ? "pointer" : "default"}
          onClick={() => handleOrder && handleOrder(colonne as OrderDemandesRestitution["orderBy"])}
          bgColor={getCellBgColor(colonne)}
          w={COLUMNS_WIDTH[colonne as keyof typeof COLUMNS_WIDTH]}
          minW={COLUMNS_WIDTH[colonne as keyof typeof COLUMNS_WIDTH]}
          maxW={COLUMNS_WIDTH[colonne as keyof typeof COLUMNS_WIDTH]}
          left={getLeftOffset({ colonne, stickyColonnes, colonneFilters })}
          zIndex={isSticky ? 2 : undefined}
          boxShadow={{
            lg: "none",
            xl: "inset -1px 0px 0px 0px #f6f6f6",
          }}
          position={{
            lg: "static",
            xl: isSticky ? "sticky" : "static",
          }}
        >
          <Box sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip label={overrideTooltip ? overrideTooltip(DEMANDES_COLUMNS[colonne]) : DEMANDES_COLUMNS[colonne]} placement="top">
              <Box
                fontSize={12}
                fontWeight={700}
                lineHeight={"20px"}
                textTransform={"uppercase"}
                textOverflow={"ellipsis"}
                alignSelf={"stretch"}
                isTruncated
                whiteSpace="nowrap"
              >
                {handleOrder && order && (<OrderIcon {...order} column={colonne} />)}
                {overrideLabel || DEMANDES_COLUMNS[colonne]}
              </Box>
            </Tooltip>
            {icon}
            <Tooltip label={`${isSticky ? "Libérer" : "Figer"} la colonne ${DEMANDES_COLUMNS_OPTIONAL[colonne].toLocaleLowerCase()}`} placement="top">
              <IconButton
                aria-label={`Figer la colonne ${DEMANDES_COLUMNS_OPTIONAL[colonne].toLocaleLowerCase()}`}
                icon={
                  isSticky ?
                    <Icon icon={"ri:lock-line"} /> :
                    <Icon icon={"ri:lock-unlock-line"} />
                }
                ms={"auto"}
                size="xs"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStickyColonnes((prev) => {
                    if (prev.includes(colonne)) {
                      return prev.filter((c) => c !== colonne) as DEMANDES_COLUMNS_KEYS[];
                    }
                    return ([...prev, colonne] as DEMANDES_COLUMNS_KEYS[]).sort((a, b) =>
                      (
                        Object.keys(COLUMNS_WIDTH).indexOf(a) -
                        Object.keys(COLUMNS_WIDTH).indexOf(b)
                      )
                    );
                  });
                }}
              />
            </Tooltip>
          </Box>
        </Th>
      );
    return null;
  }
);

export const HeadLineContent = ({
  order,
  handleOrder,
  activeFilters,
  colonneFilters,
  stickyColonnes,
  setStickyColonnes,
  getCellBgColor,
  displayPilotageColumns,
  currentRS,
}: {
  order: OrderDemandesRestitution;
  handleOrder: (column: OrderDemandesRestitution["orderBy"]) => void;
  activeFilters: FiltersDemandesRestitution;
  colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
  stickyColonnes: Array<DEMANDES_COLUMNS_KEYS>;
  setStickyColonnes: React.Dispatch<React.SetStateAction<DEMANDES_COLUMNS_KEYS[]>>;
  getCellBgColor: (column: DEMANDES_COLUMNS_KEYS) => string;
  displayPilotageColumns: boolean;
  currentRS: string;
}) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <>
      <ConditionalTh
        colonne={"libelleEtablissement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"commune"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"libelleRegion"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"libelleAcademie"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"secteur"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"libelleNsf"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"libelleFormation"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"formationSpecifique"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={<TooltipIcon ml="1" mt="1px" label="Cliquez pour plus d'infos." onClick={() => openGlossaire("formation-specifique")} />}
      />
      <ConditionalTh
        colonne={"libelleNiveauDiplome"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"typeDemande"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"motif"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"differenceCapaciteScolaire"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"differenceCapaciteApprentissage"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"differenceCapaciteScolaireColoree"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        isNumeric
      />
      <ConditionalTh
        colonne={"differenceCapaciteApprentissageColoree"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"libelleColoration"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={<TooltipDefinitionColoration />}
      />
      <ConditionalTh
        colonne={"libelleFCIL"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={<TooltipDefinitionFCIL />}
      />
      <ConditionalTh
        colonne={"amiCma"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={<TooltipDefinitionAMICMA />}
      />
      <ConditionalTh
        colonne={"amiCmaValide"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"amiCmaEnCoursValidation"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"amiCmaValideAnnee"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"filiereCmq"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"nomCmq"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"inspecteurReferent"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"partenaireEconomique1"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"partenaireEconomique2"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"commentaire"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"numero"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"positionQuadrant"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={
          <TooltipDefinitionPositionQuadrant
            millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
          />
        }
      />
      <ConditionalTh
        colonne={"tauxInsertionRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={
          <TooltipDefinitionTauxEmploi6Mois
            millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
          />
        }
      />
      <ConditionalTh
        colonne={"tauxPoursuiteRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={
          <TooltipDefinitionTauxPoursuiteEtudes
            millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
          />
        }
      />
      <ConditionalTh
        colonne={"tauxDevenirFavorableRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={
          <TooltipDefinitionTauxDevenirFavorable
            millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
          />
        }
      />
      <ConditionalTh
        colonne={"tauxPressionRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={<TooltipDefinitionTauxDePression />}
      />
      <ConditionalTh
        colonne={"nbEtablissement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
        icon={<TooltipIcon ml="1" mt="1px" label="Le nombre d'établissement dispensant la formation dans la région." />}
      />
      <ConditionalTh
        colonne={"nbRecrutementRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"nbReconversionRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"nbProfesseurAssocieRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"nbFormationRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"travauxAmenagement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"travauxAmenagementCout"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"travauxAmenagementDescription"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"achatEquipement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"achatEquipementCout"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"achatEquipementDescription"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"augmentationCapaciteAccueilHebergement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"augmentationCapaciteAccueilHebergementPlaces"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"augmentationCapaciteAccueilHebergementPrecisions"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"augmentationCapaciteAccueilRestauration"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"augmentationCapaciteAccueilRestaurationPlaces"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"augmentationCapaciteAccueilRestaurationPrecisions"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"statut"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      <ConditionalTh
        colonne={"motifRefus"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
        stickyColonnes={stickyColonnes}
        setStickyColonnes={setStickyColonnes}
      />
      {displayPilotageColumns && (
        <>
          <ConditionalTh
            colonne={"pilotageCapacite"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            handleOrder={handleOrder}
            order={order}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            overrideLabel={DEMANDES_COLUMNS.pilotageCapacite.replace("{0}", currentRS)}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            icon={
              <TooltipIcon
                ml="1"
                mt="1px"
                label={
                  <Flex direction="column" gap={2}>
                    <Text>Capacité théorique issue d'Affelnet pour la rentrée 2024, voie scolaire</Text>
                    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                  </Flex>
                }
                onClick={() => openGlossaire("capacite")}
                placement={"bottom-end"}
              />
            }
            isNumeric
          />
          <ConditionalTh
            colonne={"pilotageEffectif"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            handleOrder={handleOrder}
            order={order}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            overrideLabel={DEMANDES_COLUMNS.pilotageEffectif.replace("{0}", currentRS)}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            icon={
              <TooltipIcon
                ml="1"
                mt="1px"
                label={
                  <Flex direction="column" gap={2}>
                    <Text>
                      Effectif en entrée de formation issue du Constat de Rentrée 2024,
                      comptant uniquement les élèves en voie scolaire
                    </Text>
                    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                  </Flex>
                }
                onClick={() => openGlossaire("effectif-en-entree")}
                placement={"bottom-end"}
              />
            }
            isNumeric
          />
          <ConditionalTh
            colonne={"pilotageTauxRemplissage"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            handleOrder={handleOrder}
            order={order}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            overrideLabel={DEMANDES_COLUMNS.pilotageTauxRemplissage.replace("{0}", currentRS)}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            icon={
              <TooltipIcon
                ml="1"
                mt="1px"
                label={
                  <Flex direction="column" gap={2}>
                    <Text>
                      Taux de remplissage par rapport à la capacité théorique
                      d'Affelnet pour la rentrée 2024, voie scolaire
                    </Text>
                    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                  </Flex>
                }
                onClick={() => openGlossaire("taux-de-remplissage")}
                placement={"bottom-end"}
              />
            }
            textAlign={"center"}
          />
          <ConditionalTh
            colonne={"pilotageTauxPression"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            handleOrder={handleOrder}
            order={order}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            overrideLabel={DEMANDES_COLUMNS.pilotageTauxPression.replace("{0}", currentRS)}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            icon={
              <TooltipIcon
                ml="1"
                mt="1px"
                label={
                  <Flex direction="column" gap={2}>
                    <Text>
                      Taux de pression (ou de demande dans le cas des BTS)
                      issue d'Affelnet pour la rentrée 2024, voie scolaire
                    </Text>
                    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                  </Flex>
                }
                onClick={() => openGlossaire("taux-de-pression")}
                placement={"bottom-end"}
              />
            }
            textAlign={"center"}
          />
          <ConditionalTh
            colonne={"pilotageTauxDemande"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            handleOrder={handleOrder}
            order={order}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            overrideLabel={DEMANDES_COLUMNS.pilotageTauxDemande.replace("{0}", currentRS)}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            icon={
              <TooltipIcon
                ml="1"
                mt="1px"
                label={
                  <Flex direction="column" gap={2}>
                    <Text>Le ratio entre le nombre de voeux et la capacité de la formation dans l'établissement.</Text>
                    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                  </Flex>
                }
                onClick={() => openGlossaire("taux-de-demande")}
                placement={"bottom-end"}
              />
            }
            textAlign={"center"}
          />
        </>
      )}
    </>
  );
};
