import { Box, Heading, Stack } from "@chakra-ui/react";
import { useMemo } from "react";

import type { Order, PanoramaFormations } from "@/app/(wrapped)/panorama/types";
import { useStateParams } from "@/utils/useFilters";

import { QuadrantDisplay } from "./QuadrantDisplay";
import { QuadrantTabs } from "./QuadrantTabs";
import { TendanceEnum } from "./TendanceRadio";

const filterFormations = ({ formations, filters }: { formations?: PanoramaFormations; filters: Filters }) => {
  return (
    (formations ?? [])
      // @ts-expect-error TODO
      .filter((formation) =>
        filters.effectifMin && formation.effectif ? formation.effectif >= filters.effectifMin : true
      )
      // @ts-expect-error TODO
      .filter(({ effectifPrecedent, effectif }) => {
        if (filters.effectif === TendanceEnum.tout) {
          return true;
        }

        if (filters.effectif === TendanceEnum.hausse) {
          return effectifPrecedent !== undefined && effectif !== undefined && effectif > effectifPrecedent;
        }

        if (filters.effectif === TendanceEnum.baisse) {
          return effectifPrecedent !== undefined && effectif !== undefined && effectif < effectifPrecedent;
        }
      })
      // @ts-expect-error TODO
      .filter(({ tauxPression }) => {
        if (filters.tauxPression === TendanceEnum.tout) {
          return true;
        }

        if (filters.tauxPression === TendanceEnum.hausse) {
          return tauxPression !== undefined && tauxPression >= 1.3;
        }

        if (filters.tauxPression === TendanceEnum.baisse) {
          return tauxPression !== undefined && tauxPression < 0.7;
        }
      })
      // @ts-expect-error TODO
      .filter(({ tauxInsertion, tauxInsertionPrecedent }) => {
        if (filters.tauxEmploi6Mois === TendanceEnum.tout) {
          return true;
        }

        if (filters.tauxEmploi6Mois === TendanceEnum.hausse) {
          return (
            tauxInsertionPrecedent !== undefined &&
            tauxInsertion !== undefined &&
            tauxInsertion > tauxInsertionPrecedent
          );
        }

        if (filters.tauxEmploi6Mois === TendanceEnum.baisse) {
          return (
            tauxInsertionPrecedent !== undefined &&
            tauxInsertion !== undefined &&
            tauxInsertion < tauxInsertionPrecedent
          );
        }
      })
      // @ts-expect-error TODO
      .filter(({ tauxPoursuite, tauxPoursuitePrecedent }) => {
        if (filters.tauxPoursuiteEtude === TendanceEnum.tout) {
          return true;
        }

        if (filters.tauxPoursuiteEtude === TendanceEnum.hausse) {
          return (
            tauxPoursuitePrecedent !== undefined &&
            tauxPoursuite !== undefined &&
            tauxPoursuite > tauxPoursuitePrecedent
          );
        }

        if (filters.tauxPoursuiteEtude === TendanceEnum.baisse) {
          return (
            tauxPoursuitePrecedent !== undefined &&
            tauxPoursuite !== undefined &&
            tauxPoursuite < tauxPoursuitePrecedent
          );
        }
      })
  );
};

type Filters = {
  effectifMin: number;
  effectif: TendanceEnum;
  tauxPression: TendanceEnum;
  tauxEmploi6Mois: TendanceEnum;
  tauxPoursuiteEtude: TendanceEnum;
};

const useQuadrantSection = (formations?: PanoramaFormations) => {
  const [filters, setFilters] = useStateParams<Filters>({
    defaultValues: {
      effectifMin: 0,
      effectif: TendanceEnum.tout,
      tauxPression: TendanceEnum.tout,
      tauxEmploi6Mois: TendanceEnum.tout,
      tauxPoursuiteEtude: TendanceEnum.tout,
    },
    prefix: "quadrant",
  });

  const filteredFormations = useMemo(() => filterFormations({ formations, filters }), [filters, formations]);

  const effectifEntree: string = useMemo(
    // @ts-expect-error TODO
    () => filteredFormations?.reduce((acc, { effectif }) => acc + (effectif ?? 0), 0).toString() ?? "-",
    [filteredFormations]
  );

  return {
    filters,
    setFilters,
    filteredFormations,
    effectifEntree,
  };
};

interface QuadrantSectionProps {
  quadrantFormations?: PanoramaFormations;
  isLoading: boolean;
  meanPoursuite?: number;
  meanInsertion?: number;
  order?: Partial<Order>;
  handleOrder: (column: Order["orderBy"]) => void;
  codeRegion?: string;
  codeNiveauDiplome?: string;
  codeNsf?: string;
  codeDepartement?: string;
  nbFormationsTotal?: number;
  effectifEntreeTotal?: number;
}

export const QuadrantSection = ({
  quadrantFormations,
  isLoading,
  meanPoursuite,
  meanInsertion,
  order,
  handleOrder,
  codeRegion,
  codeNiveauDiplome,
  codeNsf,
  codeDepartement,
  nbFormationsTotal,
  effectifEntreeTotal,
}: QuadrantSectionProps) => {
  const { filteredFormations, filters, setFilters, effectifEntree } = useQuadrantSection(quadrantFormations);

  return (
    <Box as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Box width={"fit-content"} mb={"32px"}>
        <Heading fontWeight={"bold"} as="h2" fontSize={"28px"}>
          Analyse des formations
        </Heading>
        <Box w={"33%"} mt={"16px"}>
          <hr />
        </Box>
      </Box>
      <Stack direction={["column", "row"]} spacing="72px">
        <QuadrantTabs
          filters={filters}
          setFilters={setFilters}
          nbFormationsAffichee={filteredFormations.length}
          nbFormationsNonAffichee={(nbFormationsTotal ?? 0) - filteredFormations.length}
          effectifEntreeAffiche={isNaN(Number(effectifEntree)) ? 0 : Number(effectifEntree)}
          effectifEntreeNonAffiche={
            (effectifEntreeTotal ?? 0) - (isNaN(Number(effectifEntree)) ? 0 : Number(effectifEntree))
          }
        />
        <QuadrantDisplay
          formations={filteredFormations}
          isLoading={isLoading}
          meanInsertion={meanInsertion}
          meanPoursuite={meanPoursuite}
          order={order}
          handleOrder={handleOrder}
          codeRegion={codeRegion}
          codeNiveauDiplome={codeNiveauDiplome}
          codeNsf={codeNsf}
          codeDepartement={codeDepartement}
          effectifEntree={effectifEntree}
        />
      </Stack>
    </Box>
  );
};
