import { Divider, Flex, Heading, Tag, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import type { Role } from "shared";

import type { client } from "@/api.client";
import { RoleTag } from "@/app/(wrapped)/intentions/components/RoleTag";
import type { MotifLabel } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getMotifLabel, hasMotifAutre } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
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
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
                Établissement
              </Heading>
              <Tooltip label={demande.libelleEtablissement}>
                <Text w={["64", "72", "80", "96"]} fontSize={14} noOfLines={2}>
                  {demande.libelleEtablissement}
                </Text>
              </Tooltip>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
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
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
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
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
                Dispositif
              </Heading>
              <Text w={["64", "72", "80", "96"]} fontSize={14}>
                {demande.libelleDispositif}
              </Text>
            </Flex>
            {demande.libelleFCIL && (
              <Flex direction={"row"} gap={4}>
                <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
                  Libellé de la FCIL
                </Heading>
                <Text w={["64", "72", "80", "96"]} fontSize={14}>
                  {demande.libelleFCIL}
                </Text>
              </Flex>
            )}
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
                Auteur
              </Heading>
              <Flex w={["64", "72", "80", "96"]} direction={"row"} gap={2}>
                <Text>{demande.createdBy?.fullname}</Text>
                <RoleTag role={demande.createdBy?.role as Role} />
              </Flex>
            </Flex>
            <Flex direction={"row"} gap={4}>
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
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
              <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
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
                <Heading as="h3" w={["44", "48", "52"]} fontSize={14} fontWeight={700}>
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
              <Heading as={"h3"} fontSize={14} fontWeight={700}>
                Observations sur la demande
              </Heading>
            </Flex>
            <Flex gap={2} direction="column">
              {demande.commentaire && demande.commentaire.length ? (
                demande.commentaire.split("\n").map((p, i) => (
                  <Text key={`commentaire-${i}`} fontSize={14}>
                    {p}
                  </Text>
                ))
              ) : (
                <Text fontSize={14}>Aucune</Text>
              )}
            </Flex>
          </Flex>
          <FilesSection numero={demande.numero!} />
        </Flex>
        <Flex direction={"column"} gap={3} p={4} flex={1}>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>
              Numéro de demande
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {demande.numero}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>Rentrée scolaire</Heading>
            <Text fontSize={14}>{demande.rentreeScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>Coloration ?</Heading>
            <Text fontSize={14}>{formatBoolean(demande.coloration)}</Text>
          </Flex>
          {demande.coloration && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as={"h3"} fontSize={14} fontWeight={700}>Libellé de la coloration</Heading>
              <Text fontSize={14}>{demande.libelleColoration}</Text>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>
              Nb de places ouvertes en voie scolaire
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(demande.differenceCapaciteScolaire)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h4"} fontSize={14} fontWeight={400}>Capacité actuelle</Heading>
            <Text fontSize={14}>{demande.capaciteScolaireActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as={"h5"} fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteScolaireColoreeActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h4"} fontSize={14} fontWeight={400}>Nouvelle capacité</Heading>
            <Text fontSize={14}>{demande.capaciteScolaire}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as={"h5"} fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteScolaireColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>
              Nb de places ouvertes en apprentissage
            </Heading>
            <Text fontWeight={700} fontSize={14}>
              {formatDifferenceCapacite(demande.differenceCapaciteApprentissage)}
            </Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h4"} fontSize={14} fontWeight={400}>Capacité actuelle</Heading>
            <Text fontSize={14}>{demande.capaciteApprentissageActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as={"h5"} fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteApprentissageColoreeActuelle}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h4"} fontSize={14} fontWeight={400}>Nouvelle capacité</Heading>
            <Text fontSize={14}>{demande.capaciteApprentissage}</Text>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"} ms={4}>
            <Heading as={"h5"} fontSize={14} fontWeight={400}>- Dont place(s) colorée(s)</Heading>
            <Text>{demande.capaciteApprentissageColoree}</Text>
          </Flex>
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>
              Motif(s)
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Text fontSize={14}>{formatMotifArray(demande.motif)}</Text>
          </Flex>
          {hasMotifAutre(demande.motif) && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as={"h3"} fontSize={14} fontWeight={400}>Autre motif : {demande.autreMotif!}</Heading>
            </Flex>
          )}
          <Divider my={3} borderColor={"grey.900"} />
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h3"} fontSize={14} fontWeight={700}>
              Précisions
            </Heading>
          </Flex>
          <Flex direction={"row"} gap={4} justify={"space-between"}>
            <Heading as={"h4"} fontSize={14} fontWeight={400}>AMI/CMA ?</Heading>
            <Text>{formatBoolean(demande.amiCma)}</Text>
          </Flex>
          {demande.amiCma && demande.amiCmaValide && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as={"h5"} fontSize={14} fontWeight={400}>Financement validé en</Heading>
              <Text>{demande.amiCmaValideAnnee}</Text>
            </Flex>
          )}
          {demande.amiCma && demande.amiCmaEnCoursValidation && (
            <Flex direction={"row"} gap={4} justify={"space-between"}>
              <Heading as={"h5"} fontSize={14} fontWeight={400}>Financement en cours de validation ?</Heading>
              <Text>{formatBoolean(demande.amiCmaEnCoursValidation)}</Text>
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
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Nombre de recrutements envisagés</Heading>
                <Text>{demande.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>{formatArray([demande.discipline1RecrutementRH, demande.discipline2RecrutementRH])}</Text>
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
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Nombre de reconversions envisagées</Heading>
                <Text>{demande.nbReconversionRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>{formatArray([demande.discipline1ReconversionRH, demande.discipline2ReconversionRH])}</Text>
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
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Nombre de professeurs associés envisagés</Heading>
                <Text>{demande.nbProfesseurAssocieRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>
                  {formatArray([demande.discipline1ProfesseurAssocieRH, demande.discipline2ProfesseurAssocieRH])}
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
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Nombre de formations envisagées</Heading>
                <Text>{demande.nbRecrutementRH}</Text>
              </Flex>
              <Flex direction={"row"} gap={4} justify={"space-between"}>
                <Heading as={"h5"} fontSize={14} fontWeight={400}>Discipline(s)</Heading>
                <Text>{formatArray([demande.discipline1FormationRH, demande.discipline2FormationRH])}</Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
