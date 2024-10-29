import { Divider, Flex, Heading, Tag, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import type { Role } from "shared";

import type { client } from "@/api.client";
import { RoleTag } from "@/app/(wrapped)/intentions/perdir/components/RoleTag";
import type { MotifLabel } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getMotifLabel, hasMotifAutre } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { formatDate } from "@/utils/formatDate";
import { formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";

import { FilesSection } from "./files/FilesSection";

const formatDifferenceCapacite = (difference?: number) => {
  if (!difference) return "+0";
  if (difference > 0) return `+${difference}`;
  return difference;
};

const formatBoolean = (value?: boolean) => {
  if (value) return "Oui";
  return "Non";
};

const formatArray = (values?: Array<string | number | undefined>): string => {
  if (!values) return "Aucun(e)";
  if (values.length === 1 && values[0]) return values[0].toString();
  return _.capitalize(
    values
      .filter((value) => value)
      .join(", ")
      .toLowerCase()
  );
};

const formatMotifArray = (values?: Array<string | undefined>): string => {
  if (!values) return "Aucun";
  // Filtrer le motifs autre pour les ajouter différemment sur la synthèse
  return formatArray(
    values.filter((motif) => !hasMotifAutre([motif])).map((motif) => getMotifLabel({ motif: motif as MotifLabel }))
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
          <Tag colorScheme="purple" size={"sm"} h="fit-content">
            Campagne {demande.campagne?.annee}
          </Tag>
          <Tag colorScheme="blue" size={"sm"} h="fit-content">
            {getTypeDemandeLabel(demande.typeDemande)}
          </Tag>
        </Flex>
      </Flex>
      <Divider />
      <Flex direction={"row"} gap={4}>
        <Flex direction={"column"} gap={6} maxW={"50%"}>
          <Flex direction={"column"} gap={3} bgColor={"blueecume.975"} p={4} h="fit-content">
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Établissement
              </Text>
              <Tooltip label={demande.libelleEtablissement}>
                <Text w={["64", "72", "80", "96"]} fontSize={14} noOfLines={2}>
                  {demande.libelleEtablissement}
                </Text>
              </Tooltip>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Département
              </Text>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDepartementLibelleWithCodeDepartement({
                  libelleDepartement: demande.libelleDepartement,
                  codeDepartement: demande.codeDepartement,
                })}
              </Text>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Diplôme
              </Text>
              <Tooltip label={demande.libelleFormation}>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {demande.libelleFormation}
                </Text>
              </Tooltip>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Dispositif
              </Text>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {demande.libelleDispositif}
              </Text>
            </Flex>
            {demande.libelleFCIL && (
              <Flex direction={"row"} gap={4}>
                <Text w={["44", "48", "52"]} fontWeight={700}>
                  Libellé de la FCIL
                </Text>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {demande.libelleFCIL}
                </Text>
              </Flex>
            )}
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Auteur
              </Text>
              <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                <Text>{demande.createdBy?.fullname}</Text>
                <RoleTag role={demande.createdBy?.role as Role} />
              </Flex>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Créée le
              </Text>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {formatDate({
                  date: demande.createdAt,
                  options: { dateStyle: "short", timeStyle: "short" },
                  dateTimeSeparator: " - ",
                })}
              </Text>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Text w={["44", "48", "52"]} fontWeight={700}>
                Dernière modification le
              </Text>
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
                <Text w={["44", "48", "52"]} fontWeight={700}>
                  Modifié par
                </Text>
                <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                  <Text>{demande.updatedBy?.fullname}</Text>
                  <RoleTag role={demande.updatedBy?.role as Role} />
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex gap={3} bgColor={"blueecume.975"} p={4} direction={"column"}>
            <Flex>
              <Heading as={"h6"} fontSize={14}>
                Observations sur la demande
              </Heading>
            </Flex>
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text fontSize={14}>
                {demande.commentaire && demande.commentaire.length ? demande.commentaire.replace("\n", "-") : "Aucune"}
              </Text>
            </Flex>
          </Flex>
          <FilesSection numero={demande.numero!} />
        </Flex>
        <Flex direction={"column"} gap={3} p={4} flex={1}>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h6"} fontSize={14}>
              Numéro de demande
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {demande.numero}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Rentrée scolaire</Text>
            <Text fontSize={14}>{demande.rentreeScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Coloration ?</Text>
            <Text fontSize={14}>{formatBoolean(demande.coloration)}</Text>
          </Flex>
          {demande.coloration && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text>Complément du libellé</Text>
              <Text fontSize={14}>{demande.libelleColoration}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h6"} fontSize={14}>
              Nb de places ouvertes en voie scolaire
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(demande.differenceCapaciteScolaire)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Capacité actuelle</Text>
            <Text fontSize={14}>{demande.capaciteScolaireActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Nouvelle capacité</Text>
            <Text fontSize={14}>{demande.capaciteScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Dont place(s) colorée(s)</Text>
            <Text>{demande.capaciteScolaireColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h6"} fontSize={14}>
              Nb de places ouvertes en apprentissage
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(demande.differenceCapaciteApprentissage)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Capacité actuelle</Text>
            <Text fontSize={14}>{demande.capaciteApprentissageActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Nouvelle capacité</Text>
            <Text fontSize={14}>{demande.capaciteApprentissage}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Dont place(s) colorée(s)</Text>
            <Text>{demande.capaciteApprentissageColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h6"} fontSize={14}>
              Motif(s)
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text fontSize={14}>{formatMotifArray(demande.motif)}</Text>
          </Flex>
          {hasMotifAutre(demande.motif) && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text fontSize={14}>Autre motif : {demande.autreMotif!}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h6"} fontSize={14}>
              Précisions
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>AMI/CMA ?</Text>
            <Text>{formatBoolean(demande.amiCma)}</Text>
          </Flex>
          {demande.amiCma && demande.amiCmaValide && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text>Financement validé en</Text>
              <Text>{demande.amiCmaValideAnnee}</Text>
            </Flex>
          )}
          {demande.amiCma && demande.amiCmaEnCoursValidation && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Text>Financement en cours de validation ?</Text>
              <Text>{formatBoolean(demande.amiCmaEnCoursValidation)}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={2}>
            <Icon icon="ri:parent-line" color="black" style={{ marginTop: "auto", marginBottom: "auto" }} />
            <Heading as={"h6"} fontSize={14}>
              Besoin(s) RH exprimé(s)
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Recrutement(s) ?</Text>
            <Text>{formatBoolean(demande.recrutementRH)}</Text>
          </Flex>
          {demande.recrutementRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Nombre de recrutements envisagés</Text>
                <Text>{demande.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Discipline(s)</Text>
                <Text>{formatArray([demande.discipline1RecrutementRH, demande.discipline2RecrutementRH])}</Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Reconversion(s) ?</Text>
            <Text>{formatBoolean(demande.reconversionRH)}</Text>
          </Flex>
          {demande.reconversionRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Nombre de reconversions envisagées</Text>
                <Text>{demande.nbReconversionRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Discipline(s)</Text>
                <Text>{formatArray([demande.discipline1ReconversionRH, demande.discipline2ReconversionRH])}</Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Professeur(s) associé(s) ?</Text>
            <Text>{formatBoolean(demande.professeurAssocieRH)}</Text>
          </Flex>
          {demande.professeurAssocieRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Nombre de professeurs associés envisagés</Text>
                <Text>{demande.nbProfesseurAssocieRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Discipline(s)</Text>
                <Text>
                  {formatArray([demande.discipline1ProfesseurAssocieRH, demande.discipline2ProfesseurAssocieRH])}
                </Text>
              </Flex>
            </>
          )}
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text>Formation(s) ?</Text>
            <Text>{formatBoolean(demande.formationRH)}</Text>
          </Flex>
          {demande.formationRH && (
            <>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Nombre de formations envisagées</Text>
                <Text>{demande.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Text>Discipline(s)</Text>
                <Text>{formatArray([demande.discipline1FormationRH, demande.discipline2FormationRH])}</Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
