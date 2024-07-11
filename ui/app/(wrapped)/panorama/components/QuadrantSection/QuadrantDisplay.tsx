"use client";

import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Img,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  useParams,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect, useMemo, useState } from "react";

import { Quadrant } from "../../../../../components/Quadrant";
import { TableQuadrant } from "../../../../../components/TableQuadrant";
import { publicConfig } from "../../../../../config.public";
import { Order, PanoramaFormations } from "../../types";
import { FormationTooltipContent } from "../FormationTooltipContent";
import { effectifSizes, InfoTooltipContent } from "./InfoTooltipContent";

const Loader = () => (
  <Center height="100%" width="100%">
    <Spinner size="xl" />
  </Center>
);

const EmptyCadran = () => {
  const [bgGrey, textGrey] = useToken("colors", ["grey.975", "grey.625"]);
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      height={"100%"}
      w={"100%"}
      gap={"16px"}
      bg={bgGrey}
      color={textGrey}
      p={"56px"}
      textAlign={"center"}
    >
      <Text fontSize={"20px"} fontWeight={"700"}>
        Aucune donnée à afficher pour les filtres sélectionnés
      </Text>
      <Text fontSize={"16px"} style={{ textWrap: "pretty" }}>
        Aucune formation ne correspond à votre sélection, ou alors la donnée ne
        peut pas être affichée pour des raisons statistiques (effectif inférieur
        à 20, nouveau code formation, ...){" "}
      </Text>
      <Img src="/search.svg" alt="illustration de recherche" />
    </Flex>
  );
};

const useQuadrantDisplay = () => {
  const segment = useSelectedLayoutSegment();
  const [typeVue, setTypeVue] = useState<"quadrant" | "tableau">("quadrant");
  const [exportPath, setExportPath] = useState<URL>(
    new URL("/console/formations", publicConfig.baseUrl)
  );
  const toggleTypeVue = () => {
    if (typeVue === "quadrant") setTypeVue("tableau");
    else setTypeVue("quadrant");
  };
  const trackEvent = usePlausible();
  const [currentFormationId, setCurrentFormationId] = useState<
    string | undefined
  >();
  const searchParams = useSearchParams();
  const params = useParams<{ codeRegion: string; codeDepartement: string }>();
  const codeNiveauDiplome = searchParams.get("codeNiveauDiplome[0]");
  const codeNsf = searchParams.get("codeNsf[0]");

  useEffect(() => {
    const consoleUrl = new URL("/console/formations", publicConfig.baseUrl);

    if (params.codeRegion) {
      consoleUrl.searchParams.set("filters[codeRegion][0]", params.codeRegion);
    }

    if (params.codeDepartement) {
      consoleUrl.searchParams.set(
        "filters[codeDepartement][0]",
        params.codeDepartement
      );
    }

    if (codeNiveauDiplome) {
      consoleUrl.searchParams.set("filters[codeDiplome][0]", codeNiveauDiplome);
    }

    if (codeNsf) {
      consoleUrl.searchParams.set("filters[codeNsf][0]", codeNsf);
    }

    setExportPath(consoleUrl);
  }, [codeNiveauDiplome, codeNsf, params]);

  return {
    typeVue,
    toggleTypeVue,
    trackEvent,
    segment,
    currentFormationId,
    setCurrentFormationId,
    exportPath,
  };
};

export const QuadrantDisplay = ({
  formations,
  meanPoursuite,
  meanInsertion,
  order,
  handleOrder,
  isLoading,
}: {
  formations: PanoramaFormations;
  meanPoursuite?: number;
  meanInsertion?: number;
  order?: Partial<Order>;
  handleOrder: (column: Order["orderBy"]) => void;
  isLoading: boolean;
}) => {
  const {
    typeVue,
    toggleTypeVue,
    currentFormationId,
    setCurrentFormationId,
    exportPath,
  } = useQuadrantDisplay();

  const RenderQuadrant = useMemo(() => {
    if (isLoading) {
      return <Loader />;
    }

    if (formations?.length && meanInsertion && meanPoursuite) {
      if (typeVue === "quadrant") {
        return (
          <Quadrant
            onClick={({ cfd, codeDispositif }) =>
              setCurrentFormationId(`${cfd}_${codeDispositif}`)
            }
            meanInsertion={meanInsertion}
            meanPoursuite={meanPoursuite}
            currentFormationId={currentFormationId}
            data={formations.map((formation) => ({
              ...formation,
              codeDispositif: formation.codeDispositif ?? "",
            }))}
            TooltipContent={FormationTooltipContent}
            effectifSizes={effectifSizes}
          />
        );
      }

      return (
        <TableQuadrant
          formations={formations}
          handleClick={setCurrentFormationId}
          currentFormationId={currentFormationId}
          order={order}
          handleOrder={(column?: string) =>
            handleOrder(column as Order["orderBy"])
          }
        />
      );
    }

    return <EmptyCadran />;
  }, [
    isLoading,
    meanInsertion,
    meanPoursuite,
    typeVue,
    formations,
    setCurrentFormationId,
    currentFormationId,
    order,
    handleOrder,
  ]);

  return (
    <Box flex={1}>
      <Flex
        justify="space-between"
        flexDir={["column", null, "row"]}
        alignItems={"center"}
      >
        <Flex gap={2}>
          <Popover>
            <PopoverTrigger>
              <Button
                variant={"ghost"}
                color={"bluefrance.113"}
                leftIcon={<Icon icon="ri:eye-line" />}
              >
                Légende
              </Button>
            </PopoverTrigger>
            <PopoverContent _focusVisible={{ outline: "none" }} p="3">
              <PopoverCloseButton />
              <InfoTooltipContent />
            </PopoverContent>
          </Popover>
          {typeVue === "quadrant" && (
            <Button
              onClick={toggleTypeVue}
              variant={"ghost"}
              color={"bluefrance.113"}
              leftIcon={<Icon icon="ri:table-3" />}
            >
              Vue tableau
            </Button>
          )}
          {typeVue === "tableau" && (
            <Button
              onClick={toggleTypeVue}
              variant={"ghost"}
              color={"bluefrance.113"}
              leftIcon={<Icon icon="ri:layout-grid-line" />}
            >
              Vue quadrant
            </Button>
          )}
          <Tooltip
            label={
              <Box>
                <Text>
                  L'export de données sur les formations est accessible depuis
                  la console Orion uniquement. <br />
                  <br />
                  <strong>Cliquer pour exporter depuis la console.</strong>
                </Text>
              </Box>
            }
            fontSize="md"
            bg={"grey.50"}
          >
            <Button
              variant={"ghost"}
              color={"bluefrance.113"}
              leftIcon={<Icon icon="ri:download-line" />}
              as={Link}
              href={exportPath?.toString()}
              target="_blank"
            >
              Exporter
            </Button>
          </Tooltip>
        </Flex>
        <Text color="grey.50" fontSize="sm" textAlign="center">
          {formations?.length ?? "-"} certifications -{" "}
          {formations?.reduce(
            (acc, { effectif }) => acc + (effectif ?? 0),
            0
          ) ?? "-"}{" "}
          élèves
        </Text>
      </Flex>
      <AspectRatio ratio={1} mt={2}>
        {RenderQuadrant}
      </AspectRatio>
    </Box>
  );
};
