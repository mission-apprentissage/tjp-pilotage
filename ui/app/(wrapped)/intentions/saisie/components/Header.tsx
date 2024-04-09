import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
} from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { client } from "@/api.client";
import { DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/saisie/DEMANDES_COLUMNS";
import { Campagnes, Filters } from "@/app/(wrapped)/intentions/saisie/types";
import { isSaisieDisabled } from "@/app/(wrapped)/intentions/saisie/utils/isSaisieDisabled";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

const CampagneStatutTag = ({ statut }: { statut?: string }) => {
  switch (statut) {
    case "en cours":
      return (
        <Tag size="md" colorScheme={"green"} ml={2}>
          {statut}
        </Tag>
      );
    case "en attente":
      return (
        <Tag size="md" colorScheme={"purple"} ml={2}>
          {statut}
        </Tag>
      );
    case "terminée":
      return (
        <Tag size="md" colorScheme={"red"} ml={2}>
          {statut}
        </Tag>
      );
    default:
      return (
        <Tag size="md" colorScheme={"yellow"} ml={2}>
          {statut}
        </Tag>
      );
  }
};

const EXPORT_LIMIT = 1_000_000;
export const Header = ({
  searchParams,
  setSearchParams,
  getDemandesQueryParameters,
  searchDemande,
  setSearchDemande,
  campagnes,
  campagne,
}: {
  searchParams: {
    search?: string;
    campagne?: string;
  };
  setSearchParams: (params: { search?: string; campagne?: string }) => void;
  getDemandesQueryParameters: (
    qLimit: number,
    qOffset?: number
  ) => Partial<Filters>;
  searchDemande?: string;
  setSearchDemande: (search: string) => void;
  campagnes?: Campagnes;
  campagne?: {
    annee: string;
    statut: string;
  };
}) => {
  const trackEvent = usePlausible();
  const anneeCampagne = searchParams.campagne ?? campagne?.annee;

  const onClickSearchDemande = () => {
    setSearchParams({ search: searchDemande });
  };
  return (
    <Flex gap={2} mb={2}>
      <Flex direction={"column"} gap={1}>
        <Menu gutter={0} matchWidth={true} autoSelect={false}>
          <MenuButton
            as={Button}
            variant={"selectButton"}
            rightIcon={<ChevronDownIcon />}
            w={"100%"}
          >
            <Flex direction="row">
              <Text my={"auto"}>
                Campagne{" "}
                {campagnes?.find((c) => c.annee === anneeCampagne)?.annee ?? ""}
              </Text>
              <CampagneStatutTag
                statut={
                  campagnes?.find((c) => c.annee === anneeCampagne)?.statut
                }
              />
            </Flex>
          </MenuButton>
          <MenuList py={0} borderTopRadius={0}>
            {campagnes?.map((campagne) => (
              <MenuItem
                p={2}
                key={campagne.annee}
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    campagne: campagne.annee,
                  });
                }}
              >
                <Flex direction="row">
                  <Text my={"auto"}>Campagne {campagne.annee}</Text>
                  <CampagneStatutTag statut={campagne.statut} />
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      {isSaisieDisabled() && (
        <Flex
          borderLeftWidth={5}
          borderLeftColor={"bluefrance.113"}
          bgColor={"grey.975"}
          direction={"column"}
          gap={2}
          padding={5}
          mb={8}
        >
          <Text fontWeight={700}>Campagne de saisie 2023 terminée</Text>
          <Text fontWeight={400}>
            La campagne de saisie 2023 est terminée, vous pourrez saisir vos
            demandes pour la campagne de saisie 2024 d'ici le 15 avril.
          </Text>
        </Flex>
      )}
      <Flex
        flexDirection={["column", null, "row"]}
        justifyContent={"space-between"}
      >
        <Flex>
          <Input
            type="text"
            placeholder="Rechercher par diplôme, établissement, numéro,..."
            w="sm"
            mr={2}
            value={searchDemande}
            onChange={(e) => setSearchDemande(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onClickSearchDemande();
            }}
          />
          <Button
            bgColor={"bluefrance.113"}
            size={"md"}
            onClick={() => onClickSearchDemande()}
          >
            <Search2Icon color="white" />
          </Button>
        </Flex>
        <Flex mr="auto" ms={2}>
          <ExportMenuButton
            onExportCsv={async () => {
              trackEvent("saisie_demandes:export");
              const data = await client.ref("[GET]/demandes").query({
                query: getDemandesQueryParameters(EXPORT_LIMIT),
              });
              downloadCsv(
                "export_saisie_demandes",
                data.demandes,
                DEMANDES_COLUMNS
              );
            }}
            onExportExcel={async () => {
              trackEvent("saisie_demandes:export-excel");
              const data = await client.ref("[GET]/demandes").query({
                query: getDemandesQueryParameters(EXPORT_LIMIT),
              });
              downloadExcel(
                "export_saisie_demandes",
                data.demandes,
                DEMANDES_COLUMNS
              );
            }}
            variant="solid"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
