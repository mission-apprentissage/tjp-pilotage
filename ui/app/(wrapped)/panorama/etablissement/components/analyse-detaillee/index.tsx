import { Center, Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { useAnalyseDetaillee } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/hook";
import { Loading } from "@/components/Loading";

import { Dashboard } from "./dashboard/Dashboard";
import { FiltersSection } from "./filters/FiltersSection";
import { ListeFormations } from "./listeFormations/ListeFormations";
import { QuadrantSection } from "./quadrant/QuadrantSection";
import { TabsSection } from "./tabs/TabsSection";

const QUADRANT_FEATURE_FLAG = true;

const EtablissementAnalyseDetaillee = () => {
  const {
    etablissement,
    formations,
    chiffresIJ,
    chiffresEntree,
    statsSortie,
    filters: filtersData,
    isLoading,
    displayDashboard,
    displayQuadrant,
    displayType,
    filterTracker,
    offre,
    setOffre,
    uai,
    formationFounds,
    handleFilters,
    activeFilters,
  } = useAnalyseDetaillee();

  const renderNoFormationFound = () => (
    <Center my={16}>
      <Text fontSize={25}>
        {`Aucune formation trouvée pour l'établissement ${
          etablissement?.libelleEtablissement ?? ""
        } (${uai})`}
      </Text>
    </Center>
  );

  const renderFormations = () => (
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
          {QUADRANT_FEATURE_FLAG ? (
            <>
              {displayType === "dashboard" ? (
                <Dashboard
                  formation={formations?.[offre]}
                  chiffresIJOffre={chiffresIJ?.[offre]}
                  chiffresEntreeOffre={chiffresEntree?.[offre]}
                />
              ) : (
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
              formation={formations?.[offre]}
              chiffresIJOffre={chiffresIJ?.[offre]}
              chiffresEntreeOffre={chiffresEntree?.[offre]}
            />
          )}
        </GridItem>
      </Grid>
    </Flex>
  );

  if (isLoading) {
    return <Loading my={16} size="xl" />;
  }

  return (
    <Flex direction={"column"} id={"analyse-detaille"}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700} mt={"32px"}>
        Analyse des formations
      </Text>
      <Divider width="48px" mb={"32px"} mt={"24px"} />
      {QUADRANT_FEATURE_FLAG && (
        <TabsSection
          displayDashboard={displayDashboard}
          displayQuadrant={displayQuadrant}
          displayType={displayType}
        />
      )}
      {formationFounds ? renderFormations() : renderNoFormationFound()}
      <Divider mb={"32px"} mt={"24px"} />
    </Flex>
  );
};

export { EtablissementAnalyseDetaillee };
