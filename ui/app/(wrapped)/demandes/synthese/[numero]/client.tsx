"use client";

import { Container, Flex, Grid, GridItem } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { parse } from "qs";
import { useEffect } from "react";
import { hasRole, RoleEnum} from 'shared';
import { isCampagneEnCours } from "shared/utils/campagneUtils";

import { client } from "@/api.client";
import { isChangementStatutAvisDisabled } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { useAuth } from "@/utils/security/useAuth";

import { ActionsSection } from "./actions/ActionsSection";
import { EditoSection } from "./actions/EditoSection";
import { InformationHeader } from "./components/InformationHeader";
import { SyntheseSpinner } from "./components/SyntheseSpinner";
import { DisplayTypeEnum } from "./main/displayTypeEnum";
import { MainSection } from "./main/MainSection";
import { StepperSection } from "./stepper/StepperSection";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { user } = useAuth();
  const isPerdir = hasRole({ user, role: RoleEnum["perdir"] });
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    displayType?: DisplayTypeEnum;
  } = parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: { displayType?: DisplayTypeEnum }) => {
    router.replace(createParameterizedUrl(location.pathname, { ...searchParams, ...params }));
  };
  const { data: demande, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) router.push(`/demandes/perdir/saisie?notfound=${numero}`);
        }
      },
    }
  );

  const { mutate: submitDemandeAccessLog } = client.ref("[POST]/demande/access/submit").useMutation({});

  useEffect(() => {
    submitDemandeAccessLog({ body: { demande: { numero: numero } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (isLoading) return <SyntheseSpinner />;
  if (!demande) return null;

  return (
    <Flex width={"100%"} bg="blueecume.925" direction="column">
      <InformationHeader statut={demande.statut} />
      <Flex align="center" as={Container} direction="column" maxWidth={"container.xl"} pt={4} pb={20}>
        <Breadcrumb
          textAlign={"start"}
          py={2}
          ml={4}
          mb={4}
          me="auto"
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: "/demandes/perdir/saisie" },
            {
              title: `Demande n°${demande?.numero}`,
              to: `/demandes/perdir/synthese/${demande?.numero}`,
              active: true,
            },
          ]}
        />
        {isCampagneEnCours(demande.campagne) ? (
          <Flex direction={"column"} gap={8}>
            <StepperSection demande={demande} />
            <Grid templateColumns={"repeat(4, 1fr)"} gap={6}>
              <GridItem colSpan={
                isChangementStatutAvisDisabled({user, statut: demande.statut}) && !isPerdir ? 4 : 3
              }>
                <MainSection
                  demande={demande}
                  displayType={searchParams.displayType ?? DisplayTypeEnum.synthese}
                  displaySynthese={displaySynthese}
                  displayCommentairesEtAvis={displayCommentairesEtAvis}
                />
              </GridItem>
              {isPerdir && (
                <GridItem colSpan={1}>
                  <EditoSection />
                </GridItem>
              )}
              {!isChangementStatutAvisDisabled({user, statut: demande.statut}) && (
                <GridItem colSpan={1}>
                  <ActionsSection demande={demande} />
                </GridItem>
              )}
            </Grid>
          </Flex>
        ) : (
          <MainSection
            demande={demande}
            displayType={searchParams.displayType ?? DisplayTypeEnum.synthese}
            displaySynthese={displaySynthese}
            displayCommentairesEtAvis={displayCommentairesEtAvis}
          />
        )}
      </Flex>
    </Flex>
  );
};
