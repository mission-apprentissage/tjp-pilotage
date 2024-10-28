import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import type { Campagne } from "@/app/(wrapped)/intentions/saisie/types";

export const RentreeScolaireField = ({
  disabled,
  className,
  campagne,
}: {
  disabled?: boolean;
  className?: string;
  campagne?: Campagne;
}) => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<IntentionForms>();

  const rentreeScolaireOptions = [0, 1, 2, 3, 4, 5].map(
    (offsetRentree: number) => parseInt(campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE) + offsetRentree
  );

  const rentreeScolaire = watch("rentreeScolaire");

  useEffect(
    () =>
      watch(({ rentreeScolaire, typeDemande }, { name }) => {
        if (name !== "rentreeScolaire") return;

        // Le type de demande ajustement est possible uniquement pour la rentrée scolaire actuelle
        if (rentreeScolaire === parseInt(campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE)) {
          setValue("typeDemande", "ajustement");
        } else if (typeDemande === "ajustement") {
          setValue("typeDemande", "");
        }
      }).unsubscribe
  );

  return (
    <FormControl className={className} isInvalid={!!errors.rentreeScolaire} isRequired>
      <FormLabel>Rentrée scolaire</FormLabel>
      <Menu gutter={0} matchWidth={true} autoSelect={false}>
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
          isDisabled={disabled}
        >
          <Flex direction="row">
            <Text ms={2}>{rentreeScolaire}</Text>
            {rentreeScolaire === parseInt(campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE) && (
              <Tag mx={3} colorScheme="red">
                Ajustement RS {rentreeScolaire}
              </Tag>
            )}
          </Flex>
        </MenuButton>
        <MenuList py={0} borderTopRadius={0}>
          {rentreeScolaireOptions.map((rentreeScolaireOption) => (
            <MenuItem
              p={2}
              key={rentreeScolaireOption}
              onClick={() => setValue("rentreeScolaire", rentreeScolaireOption)}
            >
              <Flex direction="row" w="100%">
                <Text ms={2}>{rentreeScolaireOption}</Text>
                {rentreeScolaireOption === parseInt(campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE) && (
                  <Tag mx={3} colorScheme="red">
                    Ajustement RS {rentreeScolaireOption}
                  </Tag>
                )}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {errors.rentreeScolaire && <FormErrorMessage>{errors.rentreeScolaire.message}</FormErrorMessage>}
    </FormControl>
  );
};
