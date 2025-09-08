import { Button, Divider, Flex, Text, useDisclosure, useToken, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { OptionType } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import type { Filters } from "@/app/(wrapped)/demandes/saisie/types";
import { DoubleArrowLeft } from "@/components/icons/DoubleArrowLeft";
import { DoubleArrowRight } from "@/components/icons/DoubleArrowRight";
import { Multiselect } from "@/components/Multiselect";

export const SideSection = ({
  isRecapView = false,
  isNouvelleDemandeDisabled,
  filterTracker,
  handleFilters,
  activeFilters,
  domaines,
  diplomes,
  formations,
  nomsCmq,
  filieresCmq,
}: {
  isRecapView?: boolean;
  isNouvelleDemandeDisabled: boolean;
  filterTracker: (filterName: keyof Filters) => () => void;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  activeFilters: Filters;
  diplomes: OptionType[];
  domaines: OptionType[];
  formations: OptionType[];
  nomsCmq: OptionType[];
  filieresCmq: OptionType[];
}) => {
  const statut = activeFilters.statut === undefined ? "none" : activeFilters.statut;

  const { data: countDemandes } = client.ref("[GET]/demandes/count").useQuery({
    query: {
      ...activeFilters,
    },
  });

  const bluefrance113 = useToken("colors", "bluefrance.113");
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Flex direction={"column"}>
      <Flex
        direction={"column"}
        gap={5}
        h={"fit-content"}
        flex={"shrink"}
        mt={5}
      >
        {isOpen ? (
          <Button
            variant="externalLink"
            leftIcon={<DoubleArrowLeft />}
            onClick={() => onToggle()}
            cursor="pointer"
            px={5}
          >
            Masquer les filtres
          </Button>
        ) : (
          <Button
            variant="externalLink"
            rightIcon={<DoubleArrowRight />}
            onClick={() => onToggle()}
            cursor="pointer"
            px={5}
          />
        )
        }
        {isOpen && (
          <VStack flex="1" align="flex-start" spacing={1}>
            {/* Toutes */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", undefined)}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:stack-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text fontWeight={isRecapView && statut === "none" ? "bold" : "normal"} fontSize={14}>
                  {countDemandes?.total}
                </Text>
              }
              isActive={statut === "none"}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text fontWeight={isRecapView && statut === "none" ? "bold" : "normal"} fontSize={14} me={"auto"}>
                Toutes
              </Text>
            </Button>

            {/* Dossiers complets */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["dossier complet"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:task-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["dossier complet"] ? "bold" : "normal"}
                  fontSize={14}
                >
                  {countDemandes?.[DemandeStatutEnum["dossier complet"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["dossier complet"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["dossier complet"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Dossiers complets
              </Text>
            </Button>

            {/* Dossiers incomplets */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["dossier incomplet"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:file-warning-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["dossier incomplet"] ? "bold" : "normal"}
                  fontSize={14}
                >
                  {countDemandes?.[DemandeStatutEnum["dossier incomplet"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["dossier incomplet"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["dossier incomplet"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Dossiers incomplets
              </Text>
            </Button>

            {/* Propositions */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["proposition"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:file-unknow-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["proposition"] ? "bold" : "normal"}
                  fontSize={14}
                >
                  {countDemandes?.[DemandeStatutEnum["proposition"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["proposition"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["proposition"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Propositions
              </Text>
            </Button>

            {/* Projet de demande */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["projet de demande"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:file-text-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["projet de demande"] ? "bold" : "normal"}
                  fontSize={14}
                >
                  {countDemandes?.[DemandeStatutEnum["projet de demande"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["projet de demande"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["projet de demande"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Projet de demande
              </Text>
            </Button>

            {/* Prêts pour le vote */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["prêt pour le vote"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:file-user-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["prêt pour le vote"] ? "bold" : "normal"}
                  fontSize={14}
                >
                  {countDemandes?.[DemandeStatutEnum["prêt pour le vote"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["prêt pour le vote"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["prêt pour le vote"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Prêt pour le vote
              </Text>
            </Button>

            {/* Demandes validées */}
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["demande validée"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:checkbox-circle-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["demande validée"] ? "bold" : "normal"}
                  fontSize={14}
                >
                  {countDemandes?.[DemandeStatutEnum["demande validée"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["demande validée"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["demande validée"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Demandes validées
              </Text>
            </Button>
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => handleFilters("statut", DemandeStatutEnum["refusée"])}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon icon={"ri:close-circle-line"} color={bluefrance113} width={"24px"} />}
              rightIcon={
                <Text fontWeight={isRecapView && statut === DemandeStatutEnum["refusée"] ? "bold" : "normal"} fontSize={14}>
                  {countDemandes?.[DemandeStatutEnum["refusée"]]}
                </Text>
              }
              isActive={statut === DemandeStatutEnum["refusée"]}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text
                fontWeight={isRecapView && statut === DemandeStatutEnum["refusée"] ? "bold" : "normal"}
                fontSize={14}
                me={"auto"}
              >
                Demandes refusées
              </Text>
            </Button>
            <Divider my={2} />
            <Text fontSize={12} color="grey.425" mb={1} ms={2}>
              Visible par vous uniquement
            </Text>
            <Button
              bgColor={"unset"}
              size="sm"
              onClick={() => {
                handleFilters("statut", "suivies");
              }}
              width={"100%"}
              iconSpacing={2}
              leftIcon={<Icon width="24px" icon="ri:bookmark-line" color={bluefrance113} />}
              rightIcon={
                <Text fontWeight={isRecapView && statut === "suivies" ? "bold" : "normal"} fontSize={14}>
                  {countDemandes?.["suivies"]}
                </Text>
              }
              isActive={statut === "suivies"}
              _active={{
                borderRadius: "none",
                bg: "bluefrance.950",
              }}
              p={5}
            >
              <Text fontWeight={isRecapView && statut === "suivies" ? "bold" : "normal"} fontSize={14} me={"auto"}>
                Demandes suivies
              </Text>
            </Button>
            {!isNouvelleDemandeDisabled && (
              <Button
                bgColor={"unset"}
                size="sm"
                onClick={() => handleFilters("statut", DemandeStatutEnum["brouillon"])}
                width={"100%"}
                iconSpacing={2}
                leftIcon={<Icon icon={"ri:draft-line"} color={bluefrance113} width={"24px"} />}
                rightIcon={
                  <Text
                    fontWeight={isRecapView && statut === DemandeStatutEnum["brouillon"] ? "bold" : "normal"}
                    fontSize={14}
                  >
                    {countDemandes?.[DemandeStatutEnum["brouillon"]]}
                  </Text>
                }
                isActive={statut === DemandeStatutEnum["brouillon"]}
                _active={{
                  borderRadius: "none",
                  bg: "bluefrance.950",
                }}
                p={5}
              >
                <Text
                  fontWeight={isRecapView && statut === DemandeStatutEnum["brouillon"] ? "bold" : "normal"}
                  fontSize={14}
                  me={"auto"}
                >
                Brouillons
                </Text>
              </Button>
            )}
            <Divider my={2} />
            <Flex direction={"column"} px={2} gap={2}>
              <Multiselect
                onClose={filterTracker("codeNiveauDiplome")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
                options={diplomes}
                value={activeFilters.codeNiveauDiplome ?? []}
                disabled={diplomes.length === 0}
                hasDefaultValue={false}
              >
                Diplôme
              </Multiselect>
              <Multiselect
                onClose={filterTracker("codeNsf")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("codeNsf", selected)}
                options={domaines}
                value={activeFilters.codeNsf ?? []}
                disabled={domaines.length === 0}
                hasDefaultValue={false}
              >
                Domaine de formation
              </Multiselect>
              <Multiselect
                onClose={filterTracker("cfd")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("cfd", selected)}
                options={formations}
                value={activeFilters.cfd ?? []}
                disabled={formations.length === 0}
                hasDefaultValue={false}
              >
                Formation
              </Multiselect>
              <Multiselect
                onClose={filterTracker("nomCmq")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("nomCmq", selected)}
                options={formations}
                value={activeFilters.nomCmq ?? []}
                disabled={nomsCmq.length === 0}
                hasDefaultValue={false}
              >
                CMQ
              </Multiselect>
              <Multiselect
                onClose={filterTracker("filiereCmq")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("filiereCmq", selected)}
                options={filieresCmq}
                value={activeFilters.filiereCmq ?? []}
                disabled={filieresCmq.length === 0}
                hasDefaultValue={false}
              >
                Filière CMQ
              </Multiselect>
            </Flex>
          </VStack>
        )}
      </Flex>
    </Flex>
  );
};
