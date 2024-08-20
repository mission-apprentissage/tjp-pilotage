import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  Text,
} from "@chakra-ui/react";

import { Intention } from "../types";

export const RentreeScolaireField = ({
  demande,
  className,
}: {
  demande: Intention;
  className?: string;
}) => {
  return (
    <FormControl className={className}>
      <FormLabel>Rentrée scolaire</FormLabel>
      <Menu gutter={0} matchWidth={true} autoSelect={true}>
        <MenuButton
          as={Button}
          variant={"selectButton"}
          rightIcon={<ChevronDownIcon />}
          width={[null, null, "72"]}
          size="md"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="grey.900"
          bg={"white"}
          isDisabled={true}
        >
          <Flex direction="row">
            <Text ms={2}>{demande.rentreeScolaire}</Text>
          </Flex>
        </MenuButton>
      </Menu>
    </FormControl>
  );
};
