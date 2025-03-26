import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, HStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo, useRef } from "react";

import { DoubleArrowRight } from "@/components/icons/DoubleArrowRight";

import { useGlossaireContext } from "./glossaireContext";
import { GlossaireEntryContent } from "./GlossaireEntryContent";
import { GlossaireListContent } from "./GlossaireListContent";

export const Glossaire = () => {
  const { isOpen, openGlossaire, closeGlossaire, selectedEntry, setSelectedEntry, entries } = useGlossaireContext();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentContent = useMemo(() => {
    if (selectedEntry) {
      return <GlossaireEntryContent id={selectedEntry} />;
    }

    return <GlossaireListContent selectEntry={(e: string) => setSelectedEntry(e)} initialEntries={entries} />;
  }, [selectedEntry, setSelectedEntry, entries]);


  return (
    <Box display={"flex"} flexGrow={"1"} justifyContent={"end"} zIndex={"tooltip"}>
      <Button
        variant={"secondary"}
        leftIcon={<QuestionOutlineIcon height={"14px"} width={"14px"} />}
        onClick={() => openGlossaire()}
        color="bluefrance.113"
        fontSize={14}
      >
        Glossaire
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={closeGlossaire} size={"lg"}>
        <DrawerContent>
          <DrawerHeader>
            <HStack justifyContent={"space-between"}>
              <Button
                variant={"unstyled"}
                color="bluefrance.113"
                leftIcon={<Icon icon="ri:arrow-left-line" />}
                onClick={() => setSelectedEntry(undefined)}
                sx={{ visibility: selectedEntry ? "visible" : "hidden" }}
                display={"flex"}
              >
                <span style={{ paddingBottom: "3px" }}>Retour</span>
              </Button>
              <Button
                ref={closeButtonRef}
                variant={"unstyled"}
                color="bluefrance.113"
                rightIcon={<DoubleArrowRight />}
                onClick={closeGlossaire}
                display="flex"
              >
                <span style={{ paddingBottom: "3px" }}>Fermer</span>
              </Button>
            </HStack>
          </DrawerHeader>
          <DrawerBody>{currentContent}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
