import { Flex, Heading, Img, Link, Text } from "@chakra-ui/react";

export const NotInScope = ({ cfd }: { cfd: string }) => {
  return (
    <Flex px={"56px"} py={"132px"} bgColor="grey.975">
      <Flex
        direction={"column"}
        gap={4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Heading
          as="h3"
          fontSize={"20px"}
          fontWeight={"bold"}
          color="grey.625"
          textAlign={"center"}
        >
          Formation absente
        </Heading>
        <Text color="grey.625">
          Cette formation n'est pas enseignée dans le territoire choisi. Vous
          pouvez{" "}
          <Link
            color="bluefrance.113"
            textDecoration="underline"
            fontWeight="bold"
            href={`/console/formations?filters[cfd][0]=${cfd}&withAnneeCommune=true`}
            target="_blank"
          >
            consulter ses données régionales ou nationales
          </Link>{" "}
          dans la console des formations ou{" "}
          <Link
            color="bluefrance.113"
            textDecoration="underline"
            fontWeight="bold"
            href={`/console/etablissements?filters[cfd][0]=${cfd}&withAnneeCommune=true`}
            target="_blank"
          >
            afficher la liste des établissements
          </Link>{" "}
          qui la proposent dans la console établissements.
        </Text>
        <Img
          height="160px"
          src="/illustrations/loupe-recherche.svg"
          alt="Illustration d'une loupe"
          my={"auto"}
        />
      </Flex>
    </Flex>
  );
};
