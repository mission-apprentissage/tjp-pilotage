import { Box, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { TauxPressionScale } from "@/app/(wrapped)/components/TauxPressionScale";
import { FORMATION_ETABLISSEMENT_COLUMNS } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import { Order } from "@/app/(wrapped)/console/etablissements/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";

import { Filters } from "../types";
export const HeadLineContent = ({
  order,
  setSearchParams,
}: {
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: number;
  }) => void;
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
      zIndex={1}
    >
      <Tr>
        <Th />
        <Th>{FORMATION_ETABLISSEMENT_COLUMNS.rentreeScolaire}</Th>
        <Th
          cursor="pointer"
          onClick={() => handleOrder("libelleEtablissement")}
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
        <Th cursor="pointer" onClick={() => handleOrder("libelleFormation")}>
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFormation}
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif1")}>
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif1}
          <TooltipIcon
            ml="1"
            label="Nb d'élèves"
            onClick={() => openGlossaire("effectifs")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif2")}>
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif2}
          <TooltipIcon
            ml="1"
            label="Nb d'élèves"
            onClick={() => openGlossaire("effectifs")}
          />
        </Th>
        <Th isNumeric cursor="pointer" onClick={() => handleOrder("effectif3")}>
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif3}
          <TooltipIcon
            ml="1"
            label="Nb d'élèves"
            onClick={() => openGlossaire("effectifs")}
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
        <Th>
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
        <Th cursor="pointer" onClick={() => handleOrder("cpcSousSecteur")}>
          <OrderIcon {...order} column="cpcSousSecteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpcSousSecteur}
        </Th>
        <Th cursor="pointer" onClick={() => handleOrder("libelleNsf")}>
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNsf}
          <TooltipIcon
            ml="1"
            label="cliquez pour plus d'infos."
            onClick={() => openGlossaire("domaine-de-formation-nsf")}
          />
        </Th>
      </Tr>
    </Thead>
  );
};
