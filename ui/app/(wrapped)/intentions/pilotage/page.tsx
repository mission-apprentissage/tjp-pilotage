"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CadranSection } from "@/app/(wrapped)/intentions/pilotage/components/CadranSection";

import { api } from "../../../../api.client";
import { withAuth } from "../../../../utils/security/withAuth";
import { CartoSection } from "./components/CartoSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueOuverturesFermeturesSection } from "./components/VueOuverturesFermeturesSection";
import { VueTauxTransformationSection } from "./components/VueTauxTransformationSection";
import { IndicateurType, Scope, TerritoiresFilters } from "./types";

export default withAuth(
  "restitution-intentions/lecture",
  function PilotageIntentions() {
    const [scope, setScope] = useState<{
      type: Scope;
      value: string | undefined;
    }>();
    const [territoiresFilters, setTerritoiresFilters] = useState<
      Partial<TerritoiresFilters>
    >({});
    const [indicateur, setIndicateur] =
      useState<IndicateurType>("tauxTransformation");

    const handleTerritoiresFilters = (
      type: keyof TerritoiresFilters,
      value: TerritoiresFilters[keyof TerritoiresFilters]
    ) => {
      setTerritoiresFilters({ [type]: value });
      setScope({ type, value });
    };

    const { data, isLoading: isLoading } = useQuery({
      keepPreviousData: true,
      staleTime: 10000000,
      queryKey: ["pilotageTransfo"],
      queryFn: api.getTransformationStats({ query: {} }).call,
    });

    const indicateurOptions = [
      {
        label: "Taux de transformation",
        value: "tauxTransformation",
        isDefault: true,
      },
    ];

    const handleIndicateurChange = (indicateur: string): void => {
      setIndicateur(indicateur as IndicateurType);
    };

    return (
      <Container maxWidth={"100%"} bg="blue.faded">
        <Container maxWidth={"container.xl"} py="4">
          <FiltersSection
            activeTerritoiresFilters={territoiresFilters}
            handleTerritoiresFilters={handleTerritoiresFilters}
            isLoading={isLoading}
            data={data}
          />

          <Box>
            <SimpleGrid spacing={8} columns={[2]} mt={8}>
              <Box>
                <IndicateursClesSection
                  data={data}
                  isLoading={isLoading}
                  scope={scope}
                />
              </Box>
              <CartoSection
                data={data}
                isLoading={isLoading}
                indicateur={indicateur}
                handleIndicateurChange={handleIndicateurChange}
                indicateurOptions={indicateurOptions}
              />
            </SimpleGrid>
            <Box mt={14}>
              <CadranSection scope={scope} />
            </Box>
            <SimpleGrid spacing={5} columns={[2]} mt={14}>
              <VueTauxTransformationSection
                data={data}
                isLoading={isLoading}
                codeRegion={territoiresFilters.regions}
              />
              <VueOuverturesFermeturesSection
                data={data}
                isLoading={isLoading}
                codeRegion={territoiresFilters.regions}
              />
            </SimpleGrid>
          </Box>
        </Container>
      </Container>
    );
  }
);
