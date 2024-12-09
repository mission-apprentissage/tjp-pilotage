import { AccordionButton, AccordionItem, AccordionPanel, Box, HStack, Text, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { themeDefinition } from "@/theme/theme";

interface LandingAccordionItemProps {
  children: React.ReactNode;
  label: string;
}

export const LandingAccordionItem = ({ label, children }: LandingAccordionItemProps) => {
  const grey900Color = useToken("colors", "grey.900");
  const grey975Color = useToken("colors", "grey.975");

  return (
    <AccordionItem border="1px" borderColor={grey900Color} width="100%">
      {({ isExpanded }) => (
        <>
          <Text as="h2" backgroundColor={isExpanded ? grey975Color : "auto"}>
            <AccordionButton>
              <HStack padding="16px" width="100%">
                <Text as="span" flex="1" textAlign="left" fontSize="16px" fontWeight={isExpanded ? 500 : 400}>
                  {label}
                </Text>
                <Icon
                  icon={isExpanded ? "ri:subtract-fill" : "ri:add-fill"}
                  fontSize="24px"
                  color={themeDefinition.colors.bluefrance[113]}
                />
              </HStack>
            </AccordionButton>
          </Text>
          <AccordionPanel>
            <Box padding="8px 16px">{children}</Box>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
