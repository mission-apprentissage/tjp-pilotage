import { Button, Container, Flex, FormLabel, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";

import { useDomaineDeFormation } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/domaineDeFormationContext";
import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import { useNsfContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/nsfContext";
import { SelectNsf } from "@/app/(wrapped)/panorama/domaine-de-formation/components/selectNsf";
import { Loading } from "@/components/Loading";

export const FiltersSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentFilters,
    handleRegionChange,
    handleAcademieChange,
    handleDepartementChange,
    handleResetFilters,
    handleCfdChange,
  } = useFormationContext();

  const { defaultNsfs, codeNsf } = useNsfContext();
  const { isLoading } = useDomaineDeFormation();
  const { regions, academies, departements } = useFormationContext();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex bgColor={"bluefrance.975"} position="sticky" top={"52px"} left={0} zIndex={20}>
      <Container maxW={"container.xl"}>
        <FormLabel htmlFor="nsf-select" py={"12px"}>
          Rechercher un domaine de formation (NSF) ou par formation
        </FormLabel>
        <Flex justify="space-between" gap={"1rem"} mb={"24px"} mt={"12px"} align="center">
          <SelectNsf
            hideLabel
            defaultNsfs={defaultNsfs}
            defaultSelected={defaultNsfs.find((nsf) => nsf.value === codeNsf) ?? null}
            w={"100%"}
            flex={2}
            isClearable={true}
            routeSelectedNsf={(selected) => {
              const params = new URLSearchParams(searchParams);
              if (selected.type === "formation") {
                if (selected.nsf === codeNsf) {
                  handleCfdChange({ cfd: selected.value });
                } else {
                  params.set("cfd", selected.value);
                  router.push(`/panorama/domaine-de-formation/${selected.nsf}?${params.toString()}`);
                }
              } else {
                params.delete("cfd");
                router.push(`/panorama/domaine-de-formation/${selected.value}?${params.toString()}`);
              }
            }}
          />
          <Flex direction="row" gap={4} mt="auto">
            <Select
              placeholder="Région: Toutes"
              onChange={(e) => handleRegionChange(e.target.value)}
              bgColor={"white"}
              value={currentFilters.codeRegion}
              autoFocus={true}
              borderWidth={"1px"}
              borderStyle={"solid"}
              borderColor={"grey.900"}
              aria-label="Sélectionner une région"
              flex={1}
            >
              {regions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Académie: Toutes"
              onChange={(e) => handleAcademieChange(e.target.value)}
              bgColor={"white"}
              value={currentFilters.codeAcademie}
              autoFocus={true}
              borderWidth={"1px"}
              borderStyle={"solid"}
              borderColor={"grey.900"}
              aria-label="Sélectionner une académie"
              flex={1}
            >
              {academies?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Département: Tous"
              onChange={(e) => handleDepartementChange(e.target.value)}
              bgColor={"white"}
              value={currentFilters.codeDepartement}
              autoFocus={true}
              borderWidth={"1px"}
              borderStyle={"solid"}
              borderColor={"grey.900"}
              aria-label="Sélectionner un département"
              flex={1}
            >
              {departements?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Flex flex={"0 1 0%"} justifyContent={"center"} alignItems={"center"}>
              <Button
                variant="externalLink"
                border={"none"}
                leftIcon={<Icon icon={"ri:refresh-line"} />}
                mt={"auto"}
                onClick={handleResetFilters}
              >
                Réinitialiser
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
