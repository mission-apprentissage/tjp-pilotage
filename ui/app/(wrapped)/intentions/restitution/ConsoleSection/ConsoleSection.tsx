import {
  Box,
  Center,
  chakra,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CSSProperties, Fragment } from "react";

import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";

import { TauxPressionScale } from "../../../components/TauxPressionScale";
import { STATS_DEMANDES_COLUMNS } from "../STATS_DEMANDES_COLUMN";
import {
  DemandesRestitutionIntentions,
  OrderDemandesRestitutionIntentions,
} from "../types";
import { LineContent } from "./LineContent";

const Loader = () => (
  <TableContainer
    overflowY={"auto"}
    flex={1}
    position="relative"
    height={"sm"}
    bg={"white"}
  >
    <Table variant="simple" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          <Tr key={`loader_RestitutionConsoleSection_option_${i}`} h="12">
            <Td>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

const ConditionalTh = chakra(
  ({
    className,
    children,
    style,
    colonnesFilters,
    colonne,
    onClick,
    isNumeric = false,
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonnesFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
    colonne: keyof typeof STATS_DEMANDES_COLUMNS;
    onClick?: (column: OrderDemandesRestitutionIntentions["orderBy"]) => void;
    isNumeric?: boolean;
  }) => {
    if (colonnesFilters.includes(colonne))
      return (
        <Th
          className={className}
          style={style}
          isNumeric={isNumeric}
          onClick={() =>
            onClick &&
            onClick(colonne as OrderDemandesRestitutionIntentions["orderBy"])
          }
        >
          {children}
        </Th>
      );
    return null;
  }
);

export const ConsoleSection = ({
  data,
  isLoading,
  order,
  handleOrder,
  campagne,
  colonneFilters,
}: {
  data?: DemandesRestitutionIntentions;
  isLoading: boolean;
  order: OrderDemandesRestitutionIntentions;
  handleOrder: (column: OrderDemandesRestitutionIntentions["orderBy"]) => void;
  campagne?: string;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
}) => {
  const router = useRouter();

  if (isLoading) return <Loader />;
  if (colonneFilters.length === 0)
    return (
      <Center>
        <Box>
          <Text>Il n'y a pas de colonnes à afficher.</Text>
          <Text>
            Veuillez en sélectionner dans le menu déroulant pour afficher des
            données.
          </Text>
        </Box>
      </Center>
    );

  return (
    <Flex
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      wrap={"wrap"}
      bg={"white"}
    >
      <TableContainer overflowY="auto" flex={1} position="relative">
        <Table variant="simple" size={"sm"}>
          <Thead
            position="sticky"
            top="0"
            bg="white"
            boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
            zIndex={1}
          >
            <Tr>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleEtablissement"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
                minW={300}
                maxW={300}
                position="sticky"
                bg="white"
                zIndex={"sticky"}
                left="0"
              >
                <OrderIcon {...order} column="libelleEtablissement" />
                {STATS_DEMANDES_COLUMNS.libelleEtablissement}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"commune"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
                left={300}
                position="sticky"
                bg="white"
                zIndex={"sticky"}
                boxShadow={"inset -2px 0px 0px 0px #E2E8F0"}
              >
                <OrderIcon {...order} column="commune" />
                {STATS_DEMANDES_COLUMNS.commune}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"typeDemande"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="typeDemande" />
                {STATS_DEMANDES_COLUMNS.typeDemande}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"motif"}
                order={order}
                onClick={handleOrder}
              >
                <OrderIcon {...order} column="motif" />
                {STATS_DEMANDES_COLUMNS.motif}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"niveauDiplome"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="niveauDiplome" />
                {STATS_DEMANDES_COLUMNS.niveauDiplome}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleFormation"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="libelleFormation" />
                {STATS_DEMANDES_COLUMNS.libelleFormation}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleNsf"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
                minW={200}
                maxW={200}
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="libelleNsf" />
                {STATS_DEMANDES_COLUMNS.libelleNsf}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"nbEtablissement"}
                order={order}
                onClick={handleOrder}
                isNumeric
                cursor="pointer"
                pb="4"
                minW={200}
                maxW={200}
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="nbEtablissement" />
                {STATS_DEMANDES_COLUMNS.nbEtablissement}
                <TooltipIcon
                  ml="1"
                  label="Le nombre d'établissement dispensant la formation dans la région."
                />
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleRegion"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="libelleRegion" />
                {STATS_DEMANDES_COLUMNS.libelleRegion}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleDepartement"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="libelleDepartement" />
                {STATS_DEMANDES_COLUMNS.libelleDepartement}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"differenceCapaciteScolaire"}
                order={order}
                onClick={handleOrder}
                isNumeric
                cursor="pointer"
                pb="4"
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="differenceCapaciteScolaire" />
                {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaire}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"differenceCapaciteApprentissage"}
                order={order}
                onClick={handleOrder}
                isNumeric
                cursor="pointer"
                pb="4"
                whiteSpace="normal"
              >
                <OrderIcon
                  {...order}
                  column="differenceCapaciteApprentissage"
                />
                {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissage}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"tauxInsertion"}
                order={order}
                onClick={handleOrder}
                textAlign="center"
                cursor="pointer"
                pb="4"
                minW={200}
                maxW={200}
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="tauxInsertion" />
                {STATS_DEMANDES_COLUMNS.tauxInsertion}
                <TooltipIcon
                  ml="1"
                  label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude pour cette formation à l'échelle régionale (voie scolaire)."
                />
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"tauxPoursuite"}
                order={order}
                onClick={handleOrder}
                textAlign="center"
                cursor="pointer"
                pb="4"
                minW={250}
                maxW={250}
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="tauxPoursuite" />
                {STATS_DEMANDES_COLUMNS.tauxPoursuite}
                <TooltipIcon
                  ml="1"
                  label="Tout élève inscrit à N+1 (réorientation et redoublement compris) pour cette formation à l'échelle régionale (voie scolaire)."
                />
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"devenirFavorable"}
                order={order}
                onClick={handleOrder}
                textAlign="center"
                cursor="pointer"
                pb="4"
                minW={220}
                maxW={220}
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="devenirFavorable" />
                {STATS_DEMANDES_COLUMNS.devenirFavorable}
                <TooltipIcon
                  ml="2"
                  label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation pour cette formation à l'échelle régionale (voie scolaire)."
                />
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"pression"}
                order={order}
                onClick={handleOrder}
                textAlign="center"
                cursor="pointer"
                pb="4"
                minW={170}
                maxW={170}
                whiteSpace="normal"
              >
                <OrderIcon {...order} column="pression" />
                {STATS_DEMANDES_COLUMNS.pression}
                <TooltipIcon
                  ml="1"
                  label={
                    <>
                      <Box>
                        Le ratio entre le nombre de premiers voeux et la
                        capacité de la formation au niveau régional.
                      </Box>
                      <TauxPressionScale />
                    </>
                  }
                />
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleColoration"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="libelleColoration" />
                {STATS_DEMANDES_COLUMNS.libelleColoration}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"libelleFCIL"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="libelleFCIL" />
                {STATS_DEMANDES_COLUMNS.libelleFCIL}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"commentaire"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="commentaire" />
                {STATS_DEMANDES_COLUMNS.commentaire}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"positionQuadrant"}
                order={order}
                pb={4}
                isNumeric
              >
                {STATS_DEMANDES_COLUMNS.positionQuadrant}
                <TooltipIcon
                  ml="1"
                  label="Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme."
                />
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"numero"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="numero" />
                {STATS_DEMANDES_COLUMNS.numero}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"nbRecrutementRH"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="nbRecrutementRH" />
                {STATS_DEMANDES_COLUMNS.nbRecrutementRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"disciplinesRecrutementRH"}
                order={order}
                cursor="pointer"
                pb="4"
              >
                {STATS_DEMANDES_COLUMNS.disciplinesRecrutementRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"nbReconversionRH"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="nbReconversionRH" />
                {STATS_DEMANDES_COLUMNS.nbReconversionRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"disciplinesReconversionRH"}
                order={order}
                cursor="pointer"
                pb="4"
              >
                {STATS_DEMANDES_COLUMNS.disciplinesReconversionRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"nbProfesseurAssocieRH"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="nbProfesseurAssocieRH" />
                {STATS_DEMANDES_COLUMNS.nbProfesseurAssocieRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"disciplinesProfesseurAssocieRH"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                {STATS_DEMANDES_COLUMNS.disciplinesProfesseurAssocieRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"nbFormationRH"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                <OrderIcon {...order} column="nbFormationRH" />
                {STATS_DEMANDES_COLUMNS.nbFormationRH}
              </ConditionalTh>
              <ConditionalTh
                colonnesFilters={colonneFilters}
                colonne={"disciplinesFormationRH"}
                order={order}
                onClick={handleOrder}
                cursor="pointer"
                pb="4"
              >
                {STATS_DEMANDES_COLUMNS.disciplinesFormationRH}
              </ConditionalTh>
            </Tr>
          </Thead>
          <Tbody>
            <Fragment>
              {data?.demandes.map(
                (demande: DemandesRestitutionIntentions["demandes"][0]) => {
                  return (
                    <Fragment key={`${demande.numero}`}>
                      <Tr
                        h="12"
                        _hover={{ bg: "blueecume.925" }}
                        cursor={"pointer"}
                        onClick={() =>
                          router.push(`/intentions/saisie/${demande.numero}`)
                        }
                      >
                        <LineContent
                          demande={demande}
                          campagne={campagne}
                          colonneFilters={colonneFilters}
                        />
                      </Tr>
                    </Fragment>
                  );
                }
              )}
            </Fragment>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
