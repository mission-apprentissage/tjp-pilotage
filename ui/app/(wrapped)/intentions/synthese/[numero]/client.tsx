"use client";

import { Container, Flex } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { Breadcrumb } from "@/components/Breadcrumb";

import { InformationHeader } from "./components/InformationHeader";
import { SyntheseSpinner } from "./components/SyntheseSpinner";
import { MainSection } from "./main/MainSection";

// eslint-disable-next-line react/display-name, import/no-anonymous-default-export
export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { push } = useRouter();
  const { data: demande, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) push(`/intentions/saisie?notfound=${numero}`);
        }
      },
    }
  );

  const { mutate: submitIntentionAccessLog } = client.ref("[POST]/demande/access/submit").useMutation({});

  useEffect(() => {
    submitIntentionAccessLog({ body: { intention: { numero: numero } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCampagneEnCours = demande?.campagne?.statut === CampagneStatutEnum["en cours"];

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
            { title: "Recueil des demandes", to: "/intentions" },
            {
              title: `Demande n°${demande?.numero}`,
              to: `/intentions/synthese/${demande?.numero}`,
              active: true,
            },
          ]}
        />
        <MainSection demande={demande} isCampagneEnCours={isCampagneEnCours} />
      </Flex>
    </Flex>
  );
};
