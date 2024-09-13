"use client";

import { Container, Flex, Grid, GridItem } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useEffect } from "react";
import { hasRole } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { EditoSection } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/actions/EditoSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { useAuth } from "@/utils/security/useAuth";

import { isChangementStatutAvisDisabled } from "../../../utils/statutUtils";
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
  const { auth } = useAuth();
  const isPerdir = hasRole({ user: auth?.user, role: "perdir" });
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
        onError: (error: unknown) => {
          if (isAxiosError(error) && error.response?.data?.message) {
            console.error(error);
            if (error.response?.status === 404)
              router.push(`/intentions/perdir/saisie?notfound=${numero}`);
          }
        },
      }
    );

  const { mutate: submitIntentionAccessLog } = client
    .ref("[POST]/intention/access/submit")
    .useMutation({});

  useEffect(() => {
    submitIntentionAccessLog({ body: { intention: { numero: numero } } });
  }, []);

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

  const isCampagneEnCours =
    intention?.campagne?.statut === CampagneStatutEnum["en cours"];

  if (isLoading) return <SyntheseSpinner />;
  if (!intention) return null;

  return (
    <Flex width={"100%"} bg="blueecume.925" direction="column">
      <InformationHeader statut={intention.statut} />
      <Flex
        align="center"
        as={Container}
        direction="column"
        maxWidth={"container.xl"}
        pt={4}
        pb={20}
      >
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
        {isCampagneEnCours ? (
          <Flex direction={"column"} gap={8}>
            <StepperSection intention={intention} />
            <Grid templateColumns={"repeat(4, 1fr)"} gap={6}>
              <GridItem
                colSpan={
                  isChangementStatutAvisDisabled(intention.statut) && !isPerdir
                    ? 4
                    : 3
                }
              >
                <MainSection
                  isCampagneEnCours={isCampagneEnCours}
                  intention={intention}
                  displayType={
                    searchParams.displayType ?? DisplayTypeEnum.synthese
                  }
                  displaySynthese={displaySynthese}
                  displayCommentairesEtAvis={displayCommentairesEtAvis}
                />
              </GridItem>
              {isPerdir && (
                <GridItem colSpan={1}>
                  <EditoSection />
                </GridItem>
              )}
              {!isChangementStatutAvisDisabled(intention.statut) && (
                <GridItem colSpan={1}>
                  <ActionsSection intention={intention} />
                </GridItem>
              )}
            </Grid>
          </Flex>
        ) : (
          <MainSection
            intention={intention}
            displayType={searchParams.displayType ?? DisplayTypeEnum.synthese}
            displaySynthese={displaySynthese}
            displayCommentairesEtAvis={displayCommentairesEtAvis}
            isCampagneEnCours={isCampagneEnCours}
          />
        )}
      </Flex>
    </Flex>
  );
};
