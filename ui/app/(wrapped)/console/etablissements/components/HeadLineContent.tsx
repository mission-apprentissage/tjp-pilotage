import { Box, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { OrderIcon } from "@/components/OrderIcon";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

import { ETABLISSEMENT_COLUMN_WIDTH } from "../ETABLISSEMENT_COLUMN_WIDTH";
import { FORMATION_ETABLISSEMENT_COLUMNS } from "../FORMATION_ETABLISSEMENT_COLUMNS";
import { Filters, Order } from "../types";

export const HeadLineContent = ({
  order,
  setSearchParams,
  isFirstColumnSticky,
  isSecondColumnSticky,
}: {
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: number;
  }) => void;
  isFirstColumnSticky?: boolean;
  isSecondColumnSticky?: boolean;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const trackEvent = usePlausible();
  const handleOrder = (column: Exclude<Order["orderBy"], undefined>) => {
    trackEvent("etablissements:ordre", { props: { colonne: column } });

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
      zIndex={2}
    >
      <Tr>
        <Th />
        <Th>{FORMATION_ETABLISSEMENT_COLUMNS.rentreeScolaire}</Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("libelleEtablissement")}
          left={0}
          zIndex={1}
          bgColor={"white"}
          position={{ lg: "relative", xl: "sticky" }}
          boxShadow={{
            lg: "none",
            xl: isFirstColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
        >
          <OrderIcon {...order} column="libelleEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleEtablissement}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("commune")}>
          <OrderIcon {...order} column="commune" />
          {FORMATION_ETABLISSEMENT_COLUMNS.commune}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleDepartement")}>
          <OrderIcon {...order} column="libelleDepartement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDepartement}
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("libelleNiveauDiplome")}
        >
          <OrderIcon {...order} column="libelleNiveauDiplome" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNiveauDiplome}
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("libelleFormation")}
          zIndex={1}
          bgColor={"white"}
          position={{ lg: "relative", xl: "sticky" }}
          left={{ lg: "unset", xl: ETABLISSEMENT_COLUMN_WIDTH - 1 }}
          boxShadow={{
            lg: "none",
            xl: isSecondColumnSticky
              ? "inset -2px 0px 0px 0px #E2E8F0"
              : "none",
          }}
        >
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFormation}
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif1")}>
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif1}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif2")}>
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif2}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif3")}>
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif3}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("capacite")}>
          <OrderIcon {...order} column="capacite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.capacite}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("tauxPression")}>
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPression}
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
        <Th cursor="pointer" onClick={() => handleOrder("tauxRemplissage")}>
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxRemplissage}
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
        <Th cursor="pointer" onClick={() => handleOrder("tauxInsertion")}>
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertion}
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
        <Th cursor="pointer" onClick={() => handleOrder("tauxPoursuite")}>
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuite}
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
        <Th cursor="pointer" onClick={() => handleOrder("positionQuadrant")}>
          <OrderIcon {...order} column="positionQuadrant" />
          {FORMATION_ETABLISSEMENT_COLUMNS.positionQuadrant}
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
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxDevenirFavorable")}
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorable}
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
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxInsertionEtablissement")}
        >
          <OrderIcon {...order} column="tauxInsertionEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertionEtablissement}
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
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("tauxPoursuiteEtablissement")}
        >
          <OrderIcon {...order} column="tauxPoursuiteEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuiteEtablissement}
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
          onClick={() => handleOrder("tauxDevenirFavorableEtablissement")}
        >
          <OrderIcon {...order} column="tauxDevenirFavorableEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorableEtablissement}
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
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </Th>
        <Th
          isNumeric
          cursor="pointer"
          onClick={() => handleOrder("valeurAjoutee")}
        >
          <OrderIcon {...order} column="valeurAjoutee" />
          {FORMATION_ETABLISSEMENT_COLUMNS.valeurAjoutee}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Capacité de l'établissement à insérer, en prenant en compte le
                  profil social des élèves et le taux de chômage de la zone
                  d'emploi, comparativement au taux de référence
                  d’établissements similaires.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("valeur-ajoutee")}
          />
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("secteur")}>
          <OrderIcon {...order} column="secteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.secteur}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("uai")}>
          <OrderIcon {...order} column="uai" />
          {FORMATION_ETABLISSEMENT_COLUMNS.uai}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleDispositif")}>
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDispositif}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleFamille")}>
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFamille}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
          <OrderIcon {...order} column="cfd" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cfd}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("cpc")}>
          <OrderIcon {...order} column="cpc" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpc}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("cpcSecteur")}>
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpcSecteur}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleNsf")}>
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNsf}
          <TooltipIcon
            ml="1"
            label="Cliquez pour plus d'infos."
            onClick={() => openGlossaire("domaine-de-formation-nsf")}
          />
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("effectifEntree")}>
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectifEntree}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Effectifs en entrée en première année de formation.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("effectif-en-entree")}
          />
        </Th>
      </Tr>
    </Thead>
  );
};
