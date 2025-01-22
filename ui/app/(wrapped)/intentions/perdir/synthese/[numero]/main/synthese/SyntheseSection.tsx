import { Divider, Flex, Heading, Img, Tag, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { Role } from "shared";

import type { client } from "@/api.client";
import { RoleTag } from "@/app/(wrapped)/intentions/perdir/components/RoleTag";
import type { MotifLabel } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getMotifLabel, hasMotifAutre } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { formatArray, formatBoolean, formatDate } from "@/utils/formatUtils";

import { FilesSection } from "./files/FilesSection";

const formatDifferenceCapacite = (difference?: number) => {
  if (!difference) return "+0";
  if (difference > 0) return `+${difference}`;
  return difference;
};

const formatMotifArray = (values?: Array<string | undefined>): string => {
  if (!values) return "Aucun";
  return formatArray(
    values.filter((motif) => !hasMotifAutre([motif])).map((motif) => getMotifLabel({ motif: motif as MotifLabel }))
  );
};

export const SyntheseSection = ({ intention }: { intention: (typeof client.infer)["[GET]/intention/:numero"] }) => {
  return (
    <Flex direction={"column"} gap={6} w="100%">
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h2" size="lg">
          Fiche synthèse de la demande
        </Heading>
        <Flex direction={"row"} gap={3} my="auto">
          <Tag colorScheme="purple" size={"sm"} h="fit-content" fontSize={12}>
            Campagne {intention.campagne?.annee}
          </Tag>
          <Tag colorScheme="blue" size={"sm"} h="fit-content" fontSize={12}>
            {getTypeDemandeLabel(intention.typeDemande)}
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
              <Tooltip label={intention.libelleEtablissement}>
                <Text w={["64", "72", "80", "96"]} fontSize={14} noOfLines={2}>
                  {intention.libelleEtablissement}
                </Text>
              </Tooltip>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Département
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDepartementLibelleWithCodeDepartement({
                  libelleDepartement: intention.libelleDepartement,
                  codeDepartement: intention.codeDepartement,
                })}
              </Text>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Diplôme
              </Heading>
              <Flex direction={"column"} gap={2} w={["64", "72", "80", "96"]}>
                <Tooltip label={intention.libelleFormation}>
                  <Text fontSize={14}>{intention.libelleFormation}</Text>
                </Tooltip>
                <BadgesFormationSpecifique formationSpecifique={intention.formationSpecifique} />
              </Flex>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Dispositif
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {intention.libelleDispositif}
              </Text>
            </Flex>
            {intention.libelleFCIL && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                  Libellé de la FCIL
                </Heading>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {intention.libelleFCIL}
                </Text>
              </Flex>
            )}
            {intention.inspecteurReferent && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                  Inspecteur référent
                </Heading>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {intention.inspecteurReferent}
                </Text>
              </Flex>
            )}
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Auteur
              </Heading>
              <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                <Text>{intention.createdBy?.fullname}</Text>
                <RoleTag role={intention.createdBy?.role as Role} />
              </Flex>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                Créée le
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDate({
                  date: intention.createdAt,
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
                  date: intention.updatedAt,
                  options: { dateStyle: "short", timeStyle: "short" },
                  dateTimeSeparator: " - ",
                })}
              </Text>
            </Flex>
            {intention.updatedBy && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontWeight={700} fontSize={14}>
                  Modifié par
                </Heading>
                <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                  <Text>{intention.updatedBy?.fullname}</Text>
                  <RoleTag role={intention.updatedBy?.role as Role} />
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
              {intention.commentaire && intention.commentaire.length ? (
                intention.commentaire.split("\n").map((p, i) => (
                  <Text key={`commentaire-${i}`} fontSize={14} sx={{ py: 1 }}>
                    {p}
                  </Text>
                ))
              ) : (
                <Text fontSize={14}>Aucune</Text>
              )}
            </Flex>
          </Flex>
          <FilesSection numero={intention.numero!} />
        </Flex>
        <Flex direction={"column"} gap={3} p={4} flex={1}>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Numéro de demande
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {intention.numero}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h3" fontSize={14} fontWeight={400}>Rentrée scolaire</Heading>
            <Text fontSize={14}>{intention.rentreeScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h3" fontSize={14} fontWeight={400}>Coloration ?</Heading>
            <Text fontSize={14}>{formatBoolean(intention.coloration)}</Text>
          </Flex>
          {intention.coloration && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Libellé de la coloration</Heading>
              <Text fontSize={14}>{intention.libelleColoration}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Nb de places ouvertes en voie scolaire
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(intention.differenceCapaciteScolaire)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Capacité actuelle</Heading>
            <Text fontSize={14}>{intention.capaciteScolaireActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{intention.capaciteScolaireColoreeActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Nouvelle capacité</Heading>
            <Text fontSize={14}>{intention.capaciteScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{intention.capaciteScolaireColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Nb de places ouvertes en apprentissage
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(intention.differenceCapaciteApprentissage)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Capacité actuelle</Heading>
            <Text fontSize={14}>{intention.capaciteApprentissageActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{intention.capaciteApprentissageColoreeActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Nouvelle capacité</Heading>
            <Text fontSize={14}>{intention.capaciteApprentissage}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as="h5" fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{intention.capaciteApprentissageColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14}>
              Motif(s)
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text fontSize={14}>{formatMotifArray(intention.motif)}</Text>
          </Flex>
          {hasMotifAutre(intention.motif) && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text fontSize={14}>Autre motif : {intention.autreMotif!}</Text>
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
            <Text>{formatBoolean(intention.amiCma)}</Text>
          </Flex>
          {intention.amiCma && intention.amiCmaValide && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Financement validé en</Heading>
              <Text>{intention.amiCmaValideAnnee}</Text>
            </Flex>
          )}
          {intention.amiCma && intention.amiCmaEnCoursValidation && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Financement en cours de validation ?</Heading>
              <Text>{formatBoolean(intention.amiCmaEnCoursValidation)}</Text>
            </Flex>
          )}
          {intention.cmqImplique && intention.nomCmq && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" minW="fit-content" fontSize={14}>CMQ impliqué</Heading>
              <Flex direction={"column"} gap={1}>
                <Text textAlign={"end"} fontWeight={400}>{intention.nomCmq} </Text>
                <Text textAlign={"end"}>{`(${intention.filiereCmq})`}</Text>
              </Flex>
            </Flex>
          )}
          {intention.partenairesEconomiquesImpliques && intention.partenaireEconomique1 && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h4" fontSize={14} fontWeight={400}>Partenaire(s) économique(s) impliqué(s)</Heading>
              <Text>{formatArray([intention.partenaireEconomique1, intention.partenaireEconomique2])}</Text>
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
            <Text>{formatBoolean(intention.recrutementRH)}</Text>
          </Flex>
          {intention.recrutementRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de recrutements envisagés</Heading>
                <Text>{intention.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray([intention.discipline1RecrutementRH, intention.discipline2RecrutementRH], true)}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Reconversion(s) ?</Heading>
            <Text>{formatBoolean(intention.reconversionRH)}</Text>
          </Flex>
          {intention.reconversionRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de reconversions envisagées</Heading>
                <Text>{intention.nbReconversionRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray([intention.discipline1ReconversionRH, intention.discipline2ReconversionRH], true)}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Professeur(s) associé(s) ?</Heading>
            <Text>{formatBoolean(intention.professeurAssocieRH)}</Text>
          </Flex>
          {intention.professeurAssocieRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de professeurs associés envisagés</Heading>
                <Text>{intention.nbProfesseurAssocieRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray(
                    [intention.discipline1ProfesseurAssocieRH, intention.discipline2ProfesseurAssocieRH],
                    true
                  )}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Formation(s) ?</Heading>
            <Text>{formatBoolean(intention.formationRH)}</Text>
          </Flex>
          {intention.formationRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Nombre de formations envisagées</Heading>
                <Text>{intention.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h5" fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>{formatArray([intention.discipline1FormationRH, intention.discipline2FormationRH], true)}</Text>
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
            <Text>{formatBoolean(intention.travauxAmenagement)}</Text>
          </Flex>
          {intention.travauxAmenagementCout && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Coût des travaux</Heading>
              <Text>{intention.travauxAmenagementCout}€</Text>
            </Flex>
          )}
          {intention.travauxAmenagementDescription && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Description</Heading>
              <Text>{intention.travauxAmenagementDescription}</Text>
            </Flex>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h4" fontSize={14} fontWeight={400}>Achats d'équipement ?</Heading>
            <Text>{formatBoolean(intention.achatEquipement)}</Text>
          </Flex>
          {intention.achatEquipementCout && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Coût des achats d'équipement</Heading>
              <Text>{intention.achatEquipementCout}€</Text>
            </Flex>
          )}
          {intention.achatEquipementDescription && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as="h5" fontSize={14} fontWeight={400}>Description</Heading>
              <Text>{intention.achatEquipementDescription}</Text>
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
            <Text>{formatBoolean(intention.augmentationCapaciteAccueilRestauration)}</Text>
          </Flex>
          {intention.augmentationCapaciteAccueilRestauration && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Nombre de places supplémentaires en restauration</Heading>
                <Text>{intention.augmentationCapaciteAccueilRestaurationPlaces}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Précisions</Heading>
                <Text>{intention.augmentationCapaciteAccueilRestaurationPrecisions}</Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as="h3" fontSize={14} fontWeight={400}>Augmentation de la capacité d'accueil en hébergement ?</Heading>
            <Text>{formatBoolean(intention.augmentationCapaciteAccueilHebergement)}</Text>
          </Flex>
          {intention.augmentationCapaciteAccueilHebergement && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Nombre de places supplémentaires en hébergement</Heading>
                <Text>{intention.augmentationCapaciteAccueilHebergementPlaces}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as="h4" fontSize={14} fontWeight={400}>Précisions</Heading>
                <Text>{intention.augmentationCapaciteAccueilHebergementPrecisions}</Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
