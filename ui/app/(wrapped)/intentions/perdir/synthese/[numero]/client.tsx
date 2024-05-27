"use client";

import { Container, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { Breadcrumb } from "@/components/Breadcrumb";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { ActionsSection } from "./actions/ActionsSection";
import { InformationHeader } from "./components/InformationHeader";
import { SyntheseSpinner } from "./components/SyntheseSpinner";
import { DisplayTypeEnum } from "./main/displayTypeEnum";
import { MainSection } from "./main/MainSection";
import { StepperSection } from "./stepper/StepperSection";

export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    displayType?: DisplayTypeEnum;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: { displayType?: DisplayTypeEnum }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };
  const { data: intention, isLoading } = client
    .ref("[GET]/intention/:numero")
    .useQuery(
      { params: { numero: numero } },
      {
        cacheTime: 0,
      }
    );

  const displaySynthese = () =>
    setSearchParams({
      ...searchParams,
      displayType: DisplayTypeEnum.synthese,
    });

  const displayCommentairesEtAvis = () =>
    setSearchParams({
      ...searchParams,
      displayType: DisplayTypeEnum.commentairesEtAvis,
    });

  if (isLoading) return <SyntheseSpinner />;
  if (!intention) return null;

  return (
    <Flex width={"100%"} bg="blueecume.925">
      <Flex
        align="center"
        as={Container}
        direction="column"
        maxWidth={"container.xl"}
        pt={4}
        pb={20}
      >
        {intention.statut === DemandeStatutEnum["dossier incomplet"] && (
          <InformationHeader
            status="warning"
            message={
              "Dossier incomplet, merci de vous référer aux consignes du gestionnaire"
            }
          />
        )}
        {intention.statut === DemandeStatutEnum["projet de demande"] && (
          <InformationHeader
            status="success"
            message={"La proposition a passé l'étape 1 avec succès !"}
          />
        )}
        {intention.statut === DemandeStatutEnum["prêt pour le vote"] && (
          <InformationHeader
            status="success"
            message={"La proposition a passé l'étape 2 avec succès !"}
          />
        )}
        <Breadcrumb
          textAlign={"start"}
          py={2}
          ml={4}
          mb={4}
          me="auto"
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: "/intentions/perdir" },
            {
              title: `Demande n°${intention?.numero}`,
              to: `/intentions/perdir/synthese/${intention?.numero}`,
              active: true,
            },
          ]}
        />
        <Flex direction={"column"} gap={8}>
          <StepperSection intention={intention} />
          <Grid templateColumns={"repeat(4, 1fr)"} gap={6}>
            <GridItem colSpan={3}>
              <MainSection
                intention={intention}
                displayType={
                  searchParams.displayType ?? DisplayTypeEnum.synthese
                }
                displaySynthese={displaySynthese}
                displayCommentairesEtAvis={displayCommentairesEtAvis}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <ActionsSection intention={intention} />
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
    </Flex>
  );
};
