import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  HStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";

import { DoubleArrowLeft } from "../../../../components/icons/DoubleArrowLeft";
import { DoubleArrowRight } from "../../../../components/icons/DoubleArrowRight";
import { useGlossaireContext } from "../../../contexts/glossaireContext";
import { GlossaireEntryContent } from "./GlossaireEntryContent";
import { GlossaireListContent } from "./GlossaireListContent";

export const Glossaire = () => {
  const { isOpen, onOpen, onClose, selectedEntry, setSelectedEntry } =
    useGlossaireContext();

  const currentContent = useMemo(() => {
    if (selectedEntry) {
      return <GlossaireEntryContent id={selectedEntry} />;
    }

    return (
      <GlossaireListContent selectEntry={(e: string) => setSelectedEntry(e)} />
    );
  }, [selectedEntry, setSelectedEntry]);

  return (
    <Box display={"flex"} flexGrow={"1"} justifyContent={"end"}>
      <Button
        variant={"secondary"}
        leftIcon={<DoubleArrowLeft height={24} width={24} />}
        onClick={() => onOpen()}
        color="bluefrance.113"
      >
        Glossaire
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"lg"}>
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
                variant={"unstyled"}
                color="bluefrance.113"
                rightIcon={<DoubleArrowRight />}
                onClick={onClose}
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
