import { client } from "@/api.client";
import { Container, Flex } from "@chakra-ui/react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { FiltersSection } from "./components/FiltersSection/FiltersSection";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";
import { LiensUtilesSection } from "./components/LiensUtilesSection/LiensUtilesSection";
import { FormationContextProvider } from "./context/formationContext";

type Params = {
  params: {
    codeNsf: string;
  };
};

const fetchListOfNsfs = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/domaine-de-formation")
      .query({ query: { search: undefined } }, { headers: headersList });
  } catch (e) {
    return [];
  }
};

const fetchNsf = async (codeNsf: string) => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/domaine-de-formation/:codeNsf")
      .query({ params: { codeNsf } }, { headers: headersList });
  } catch (e) {
    return null;
  }
};

export default async function PageDomaineDeFormation({
  params: { codeNsf },
}: Params) {
  const results = await fetchNsf(codeNsf);
  const nsfs = await fetchListOfNsfs();

  if (!results) {
    return notFound();
  }

  const libelleNsf = results?.libelleNsf;

  return (
    <FormationContextProvider>
      <Flex bgColor={"bluefrance.975"}>
        <Container mt={"44px"} maxW={"container.xl"}>
          <HeaderSection codeNsf={codeNsf} libelleNsf={libelleNsf} />
          <FiltersSection />
        </Container>
      </Flex>
      <LiensUtilesSection />
    </FormationContextProvider>
  );
}
