import { Divider, Flex, Grid, GridItem } from "@chakra-ui/react";

import { feature } from "../../../../../../../utils/feature";
import { Dashboard } from "../dashboard/Dashboard";
import { FiltersSection } from "../filters/FiltersSection";
import { useAnalyseDetaillee } from "../hook";
import { ListeFormations } from "../listeFormations/ListeFormations";
import { QuadrantSection } from "../quadrant/QuadrantSection";
import { DisplayTypeEnum } from "./displayTypeEnum";

export const TabsContent = (params: ReturnType<typeof useAnalyseDetaillee>) => {
  const {
    activeFilters,
    formations,
    offre,
    setOffre,
    displayType,
    chiffresEntree,
    chiffresIJ,
    etablissement,
    statsSortie,
    filters: filtersData,
    handleFilters,
    filterTracker,
  } = params;
  return (
    <Flex direction={"column"} gap={8}>
      <FiltersSection
        filtersData={filtersData}
        filters={activeFilters}
        handleFilters={handleFilters}
        filterTracker={filterTracker}
      />
      <Divider />
      <Grid templateColumns={"repeat(10, 1fr)"} gap={8}>
        <GridItem colSpan={4}>
          <ListeFormations
            formations={Object.values(formations ?? {})}
            offre={offre}
            setOffre={setOffre}
          />
        </GridItem>
        <GridItem colSpan={6}>
          {feature.etablissementQuadrant ? (
            <>
              {displayType === DisplayTypeEnum.dashboard && (
                <Dashboard
                  codeRegion={etablissement?.codeRegion}
                  formation={formations?.[offre]}
                  chiffresIJOffre={chiffresIJ?.[offre]}
                  chiffresEntreeOffre={chiffresEntree?.[offre]}
                />
              )}
              {displayType === DisplayTypeEnum.quadrant && (
                <QuadrantSection
                  formations={Object.values(formations ?? {})}
                  currentFormation={formations?.[offre]}
                  etablissement={etablissement}
                  chiffresIJ={chiffresIJ}
                  chiffresEntree={chiffresEntree}
                  statsSortie={statsSortie}
                  offre={offre}
                  setOffre={setOffre}
                />
              )}
            </>
          ) : (
            <Dashboard
              codeRegion={etablissement?.codeRegion}
              formation={formations?.[offre]}
              chiffresIJOffre={chiffresIJ?.[offre]}
              chiffresEntreeOffre={chiffresEntree?.[offre]}
            />
          )}
        </GridItem>
      </Grid>
    </Flex>
  );
};
