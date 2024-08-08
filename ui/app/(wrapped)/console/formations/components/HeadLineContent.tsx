import { Box, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { OrderIcon } from "@/components/OrderIcon";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, Order } from "../types";

export const HeadLineContent = ({
  order,
  setSearchParams,
  canShowQuadrantPosition,
}: {
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: number;
  }) => void;
  canShowQuadrantPosition?: boolean;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("formations:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };
  return (
    <Thead
      position="sticky"
      top="0"
      bg="white"
      boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
      zIndex={1}
    >
      <Tr>
        <Th />
        <Th>{FORMATION_COLUMNS.rentreeScolaire}</Th>
        <Th cursor="pointer" onClick={() => handleOrder("codeNiveauDiplome")}>
          <OrderIcon {...order} column="codeNiveauDiplome" />
          {FORMATION_COLUMNS.libelleNiveauDiplome}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleFormation")}>
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_COLUMNS.libelleFormation}
        </Th>
        <Th
          isNumeric
          cursor="pointer"
          onClick={() => handleOrder("nbEtablissement")}
        >
          <OrderIcon {...order} column="nbEtablissement" />
          {FORMATION_COLUMNS.nbEtablissement}
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif1")}>
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_COLUMNS.effectif1}
          <TooltipIcon
            ml="1"
            label="Nb d'élèves"
            onClick={() => openGlossaire("effectifs")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif2")}>
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_COLUMNS.effectif2}
          <TooltipIcon
            ml="1"
            label="Nb d'élèves"
            onClick={() => openGlossaire("effectifs")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif3")}>
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_COLUMNS.effectif3}
          <TooltipIcon
            ml="1"
            label="Nb d'élèves"
            onClick={() => openGlossaire("effectifs")}
          />
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxPression")}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_COLUMNS.tauxPression}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Le ratio entre le nombre de premiers voeux et la capacité de
                  la formation au niveau régional.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
                <TauxPressionScale />
              </Box>
            }
            onClick={() => openGlossaire("taux-de-pression")}
          />
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxRemplissage")}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_COLUMNS.tauxRemplissage}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Le ratio entre l’effectif d’entrée en formation et sa
                  capacité.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-de-remplissage")}
          />
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxInsertion")}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_COLUMNS.tauxInsertion}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  La part de ceux qui sont en emploi 6 mois après leur sortie
                  d’étude.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-emploi-6-mois")}
          />
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxPoursuite")}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_COLUMNS.tauxPoursuite}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Tout élève inscrit à N+1 (réorientation et redoublement
                  compris).
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-poursuite-etudes")}
          />
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxDevenirFavorable")}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_COLUMNS.tauxDevenirFavorable}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  (nombre d'élèves inscrits en formation + nombre d'élèves en
                  emploi) / nombre d'élèves en entrée en dernière année de
                  formation.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </Th>
        {canShowQuadrantPosition && (
          <Th>
            {FORMATION_COLUMNS.positionQuadrant}
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>
                    Positionnement du point de la formation dans le quadrant par
                    rapport aux moyennes régionales des taux d'emploi et de
                    poursuite d'études appliquées au niveau de diplôme.
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("quadrant")}
            />
          </Th>
        )}
        <Th cursor="pointer" onClick={() => handleOrder("libelleDispositif")}>
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_COLUMNS.libelleDispositif}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleFamille")}>
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_COLUMNS.libelleFamille}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
          <OrderIcon {...order} column="cfd" />
          {FORMATION_COLUMNS.cfd}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("cpc")}>
          <OrderIcon {...order} column="cpc" />
          {FORMATION_COLUMNS.cpc}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("cpcSecteur")}>
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_COLUMNS.cpcSecteur}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleNsf")}>
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_COLUMNS.libelleNsf}
          <TooltipIcon
            ml="1"
            label="cliquez pour plus d'infos."
            onClick={() => openGlossaire("domaine-de-formation-nsf")}
          />
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("effectifEntree")}>
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_COLUMNS.effectifEntree}
        </Th>
      </Tr>
    </Thead>
  );
};
