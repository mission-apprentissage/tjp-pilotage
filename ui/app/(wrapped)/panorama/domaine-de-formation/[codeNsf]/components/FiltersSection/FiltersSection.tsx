import { Button, Container, Flex, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OptionType } from "shared/schema/optionSchema";

import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import type { NsfOptions } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { SelectNsf } from "@/app/(wrapped)/panorama/domaine-de-formation/components/selectNsf";

export const FiltersSection = ({
  regionOptions,
  academieOptions,
  departementOptions,
  defaultNsfs,
  currentNsf,
}: {
  regionOptions: OptionType[];
  academieOptions: OptionType[];
  departementOptions: OptionType[];
  defaultNsfs: NsfOptions;
  currentNsf: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentFilters,
    codeNsf,
    handleRegionChange,
    handleAcademieChange,
    handleDepartementChange,
    handleResetFilters,
    handleCfdChange,
  } = useFormationContext();

  return (
    <Flex bgColor={"bluefrance.975"} position="sticky" top={"52px"} left={0} zIndex="docked">
      <Container maxW={"container.xl"}>
        <Flex justify="space-between" gap={"1rem"} my={"24px"} align="center">
          <SelectNsf
            defaultNsfs={defaultNsfs}
            defaultSelected={defaultNsfs.find((nsf) => nsf.value === currentNsf) ?? null}
            w={"100%"}
            flex={2}
            isClearable={true}
            routeSelectedNsf={(selected) => {
              const params = new URLSearchParams(searchParams);
              if (selected.type === "formation") {
                if (selected.nsf === codeNsf) {
                  handleCfdChange(selected.value);
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
              {regionOptions?.map((option) => (
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
              {academieOptions?.map((option) => (
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
              {departementOptions?.map((option) => (
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
