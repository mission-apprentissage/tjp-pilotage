import {
  Box,
  Card,
  CardBody,
  Center,
  Container,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <Card>
    <CardBody p={3} alignItems={"center"} display={"flex"}>
      <Box mr="4" flex={1}>
        {label}
      </Box>
      <Box fontWeight="bold" fontSize="2xl">
        {value}
      </Box>
    </CardBody>
  </Card>
);

export const RegionSection = () => {
  return (
    <Container
      px="36"
      as="section"
      py="8"
      bg="grey.950"
      maxWidth={"container.xl"}
    >
      <Stack direction={["column", "row"]} spacing="24px">
        <Box flex={1}>
          <FormControl>
            <FormLabel>Sélectionner une région</FormLabel>
            <Select />
          </FormControl>
        </Box>
        <Box flex={2}>
          <SimpleGrid spacing={3} columns={[2]}>
            <Center fontSize="2xl" fontWeight="bold">
              Occitanie
            </Center>
            <StatCard
              label="Tx poursuite étude dans votre région"
              value="45%"
            />
            <StatCard
              label="Tx poursuite étude dans votre région"
              value="45%"
            />
            <StatCard
              label="Tx poursuite étude dans votre région"
              value="45%"
            />
            <StatCard
              label="Tx poursuite étude dans votre région"
              value="45%"
            />
            <StatCard
              label="Tx poursuite étude dans votre région"
              value="45%"
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
};
