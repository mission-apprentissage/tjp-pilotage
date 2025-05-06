import { Divider, Flex, Heading, Img, Tag, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { Role } from "shared";
import {unEscapeString} from 'shared/utils/escapeString';

import type { client } from "@/api.client";
import { RoleTag } from "@/app/(wrapped)/demandes/components/RoleTag";
import type { AnneeCampagneMotifDemande,MotifDemandeLabel } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";
import { getMotifDemandeLabel,hasMotifAutre } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { formatArray, formatBoolean, formatDate } from "@/utils/formatUtils";

import { FilesSection } from "./files/FilesSection";

const formatDifferenceCapacite = (difference?: number) => {
  if (!difference) return "+0";
  if (difference > 0) return `+${difference}`;
  return difference;
};

const formatMotifArray = ({
  motifs,
  anneeCampagne
} :{
  motifs?: Array<string | undefined>,
  anneeCampagne: string
}): string => {
  if (!motifs) return "Aucun";
  // Filtrer le motifs autre pour les ajouter différemment sur la synthèse
  return formatArray(
    motifs.filter((motif) => !hasMotifAutre([motif])).map((motif) =>
      getMotifDemandeLabel({
        motif: motif as MotifDemandeLabel,
        anneeCampagne: anneeCampagne as AnneeCampagneMotifDemande
      })
    )
  );
};

export const SyntheseSection = ({ demande }: { demande: (typeof client.infer)["[GET]/demande/:numero"] }) => {
  return (
    <Flex direction={"column"} gap={6} w="100%">
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h2" size="lg">
          Fiche synthèse de la demande
        </Heading>
        <Flex direction={"row"} gap={3} my="auto">
          <Tag colorScheme="purple" size={"sm"} h="fit-content" fontSize={12}>
            Campagne {demande.campagne?.annee}
          </Tag>
          <Tag colorScheme="blue" size={"sm"} h="fit-content" fontSize={12}>
            {getTypeDemandeLabel(demande.typeDemande)}
          </Tag>
        </Flex>
      </Flex>
      <Divider />
      <Flex direction={"row"} gap={4}>
        <Flex direction={"column"} gap={6} maxW={"50%"}>
          <Flex direction={"column"} gap={3} bgColor={"blueecume.975"} p={4} h="fit-content">
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Établissement
              </Heading>
              <Tooltip label={demande.libelleEtablissement}>
                <Text w={["64", "72", "80", "96"]} fontSize={14} noOfLines={2}>
                  {demande.libelleEtablissement}
                </Text>
              </Tooltip>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Département
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDepartementLibelleWithCodeDepartement({
                  libelleDepartement: demande.libelleDepartement,
                  codeDepartement: demande.codeDepartement,
                })}
              </Text>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Diplôme
              </Heading>
              <Flex direction={"column"} gap={2} w={["64", "72", "80", "96"]}>
                <Tooltip label={demande.libelleFormation}>
                  <Text fontSize={14}>{demande.libelleFormation}</Text>
                </Tooltip>
                <BadgesFormationSpecifique formationSpecifique={demande.formationSpecifique} />
              </Flex>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Dispositif
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {demande.libelleDispositif}
              </Text>
            </Flex>
            {demande.libelleFCIL && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                  Libellé de la FCIL
                </Heading>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {demande.libelleFCIL}
                </Text>
              </Flex>
            )}
            {demande.inspecteurReferent && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                  Inspecteur référent
                </Heading>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {demande.inspecteurReferent}
                </Text>
              </Flex>
            )}
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Auteur
              </Heading>
              <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                <Text>{demande.createdBy?.fullname}</Text>
                <RoleTag role={demande.createdBy?.role as Role} />
              </Flex>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Créée le
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDate({
                  date: demande.createdAt,
                  options: { dateStyle: "short", timeStyle: "short" },
                  dateTimeSeparator: " - ",
                })}
              </Text>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Dernière modification le
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDate({
                  date: demande.updatedAt,
                  options: { dateStyle: "short", timeStyle: "short" },
                  dateTimeSeparator: " - ",
                })}
              </Text>
            </Flex>
            {demande.updatedBy && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                  Modifié par
                </Heading>
                <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                  <Text>{demande.updatedBy?.fullname}</Text>
                  <RoleTag role={demande.updatedBy?.role as Role} />
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex gap={3} bgColor={"blueecume.975"} p={4} direction={"column"}>
            <Flex>
              <Heading as={"h3"} fontSize={14}>
                Observations sur la demande
              </Heading>
            </Flex>
            <Flex gap={2} direction="column">
              {demande?.commentaire?.length ? (
                demande.commentaire.split("\n").map((p, i) => {
                  const key = `commentaire-${i}`;
                  return (
                    <Text key={key} fontSize={14} sx={{ py: 1 }}>
                      {unEscapeString(p)}
                    </Text>
                  );})
              ) : (
                <Text fontSize={14}>Aucune</Text>
              )}
            </Flex>
          </Flex>
          <FilesSection numero={demande.numero!} />
        </Flex>
        <Flex direction={"column"} gap={3} p={4} flex={1}>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Numéro de demande
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {demande.numero}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h3" fontSize={14} fontWeight={400}>Rentrée scolaire</Heading>
            <Text fontSize={14}>{demande.rentreeScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h3" fontSize={14} fontWeight={400}>Coloration ?</Heading>
            <Text fontSize={14}>{formatBoolean(demande.coloration)}</Text>
          </Flex>
          {demande.coloration && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Libellé de la coloration</Heading>
              <Text fontSize={14}>{demande.libelleColoration}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Nb de places ouvertes en voie scolaire
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(demande.differenceCapaciteScolaire)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Capacité actuelle</Heading>
            <Text fontSize={14}>{demande.capaciteScolaireActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteScolaireColoreeActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Nouvelle capacité</Heading>
            <Text fontSize={14}>{demande.capaciteScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteScolaireColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Nb de places ouvertes en apprentissage
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(demande.differenceCapaciteApprentissage)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Capacité actuelle</Heading>
            <Text fontSize={14}>{demande.capaciteApprentissageActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteApprentissageColoreeActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Nouvelle capacité</Heading>
            <Text fontSize={14}>{demande.capaciteApprentissage}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteApprentissageColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Motif(s)
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text fontSize={14}>{
              formatMotifArray({
                motifs: demande.motif,
                anneeCampagne: demande.campagne.annee
              })
            }
            </Text>
          </Flex>
          {hasMotifAutre(demande.motif) && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text fontSize={14}>Autre motif : {unEscapeString(demande.autreMotif)}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Précisions
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>AMI/CMA ?</Heading>
            <Text>{formatBoolean(demande.amiCma)}</Text>
          </Flex>
          {demande.amiCma && demande.amiCmaValide && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Financement validé en</Heading>
              <Text>{demande.amiCmaValideAnnee}</Text>
            </Flex>
          )}
          {demande.amiCma && demande.amiCmaEnCoursValidation && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Financement en cours de validation ?</Heading>
              <Text>{formatBoolean(demande.amiCmaEnCoursValidation)}</Text>
            </Flex>
          )}
          {demande.cmqImplique && demande.nomCmq && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" minW="fit-content" fontSize={14}>CMQ impliqué</Heading>
              <Flex direction={"column"} gap={1}>
                <Text textAlign={"end"} fontWeight={400}>{demande.nomCmq} </Text>
                <Text textAlign={"end"}>{`(${demande.filiereCmq})`}</Text>
              </Flex>
            </Flex>
          )}
          {demande.partenairesEconomiquesImpliques && demande.partenaireEconomique1 && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Partenaire(s) économique(s) impliqué(s)</Heading>
              <Text>{formatArray([demande.partenaireEconomique1, demande.partenaireEconomique2])}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={2}>
            <Icon icon="ri:parent-line" color="black" style={{ marginTop: "auto", marginBottom: "auto" }} />
            <Heading as={"h3"} fontSize={14}>
              Besoin(s) RH exprimé(s)
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Recrutement(s) ?</Heading>
            <Text>{formatBoolean(demande.recrutementRH)}</Text>
          </Flex>
          {demande.recrutementRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de recrutements envisagés</Heading>
                <Text>{demande.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray([demande.discipline1RecrutementRH, demande.discipline2RecrutementRH], true)}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Reconversion(s) ?</Heading>
            <Text>{formatBoolean(demande.reconversionRH)}</Text>
          </Flex>
          {demande.reconversionRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de reconversions envisagées</Heading>
                <Text>{demande.nbReconversionRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray([demande.discipline1ReconversionRH, demande.discipline2ReconversionRH], true)}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Professeur(s) associé(s) ?</Heading>
            <Text>{formatBoolean(demande.professeurAssocieRH)}</Text>
          </Flex>
          {demande.professeurAssocieRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de professeurs associés envisagés</Heading>
                <Text>{demande.nbProfesseurAssocieRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray(
                    [demande.discipline1ProfesseurAssocieRH, demande.discipline2ProfesseurAssocieRH],
                    true
                  )}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Formation(s) ?</Heading>
            <Text>{formatBoolean(demande.formationRH)}</Text>
          </Flex>
          {demande.formationRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de formations envisagées</Heading>
                <Text>{demande.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>{formatArray([demande.discipline1FormationRH, demande.discipline2FormationRH], true)}</Text>
              </Flex>
            </>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={2}>
            <Img src={"/icons/travauxEtEquipements.svg"} alt="" style={{ marginTop: "auto", marginBottom: "auto" }} />
            <Heading as={"h3"} fontSize={14}>
              Travaux et équipements
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Travaux ?</Heading>
            <Text>{formatBoolean(demande.travauxAmenagement)}</Text>
          </Flex>
          {demande.travauxAmenagementCout && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Coût des travaux</Heading>
              <Text>{demande.travauxAmenagementCout}€</Text>
            </Flex>
          )}
          {demande.travauxAmenagementDescription && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Description</Heading>
              <Text>{demande.travauxAmenagementDescription}</Text>
            </Flex>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Achats d'équipement ?</Heading>
            <Text>{formatBoolean(demande.achatEquipement)}</Text>
          </Flex>
          {demande.achatEquipementCout && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Coût des achats d'équipement</Heading>
              <Text>{demande.achatEquipementCout}€</Text>
            </Flex>
          )}
          {demande.achatEquipementDescription && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Description</Heading>
              <Text>{demande.achatEquipementDescription}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={2}>
            <Icon icon="ri:restaurant-line" color="black" style={{ marginTop: "auto", marginBottom: "auto" }} />
            <Heading as={"h3"} fontSize={14}>
              Internat et restauration
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Augmentation de la capacité d'accueil en restauration ?</Heading>
            <Text>{formatBoolean(demande.augmentationCapaciteAccueilRestauration)}</Text>
          </Flex>
          {demande.augmentationCapaciteAccueilRestauration && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Nombre de places supplémentaires en restauration</Heading>
                <Text>{demande.augmentationCapaciteAccueilRestaurationPlaces}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Précisions</Heading>
                <Text>{demande.augmentationCapaciteAccueilRestaurationPrecisions}</Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h3" fontSize={14} fontWeight={400}>Augmentation de la capacité d'accueil en hébergement ?</Heading>
            <Text>{formatBoolean(demande.augmentationCapaciteAccueilHebergement)}</Text>
          </Flex>
          {demande.augmentationCapaciteAccueilHebergement && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Nombre de places supplémentaires en hébergement</Heading>
                <Text>{demande.augmentationCapaciteAccueilHebergementPlaces}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Précisions</Heading>
                <Text>{demande.augmentationCapaciteAccueilHebergementPrecisions}</Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
