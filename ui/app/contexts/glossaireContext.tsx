import { useDisclosure } from "@chakra-ui/hooks";
import { createContext, useCallback, useContext, useState } from "react";

import {
  GLOSSAIRE_ENTRIES_KEYS,
  GlossaireEntryKey,
} from "../(wrapped)/components/glossaire/GlossaireEntries";

type GlossaireContextType = {
  isOpen: boolean;
  onOpen: (key?: GlossaireEntryKey | undefined) => void;
  onClose: () => void;
  selectedEntry?: string;
  setSelectedEntry: (id?: string) => void;
};

export const GlossaireContext = createContext<GlossaireContextType>(
  {} as GlossaireContextType
);

export function GlossaireProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEntry, setSelectedEntry] = useState<string | undefined>();

  const onCloseCallback = useCallback(() => {
    setSelectedEntry(undefined);
    onClose();
  }, [onClose, setSelectedEntry]);

  const onOpenCallback = useCallback(
    (key: GlossaireEntryKey | undefined) => {
      if (key && key in GLOSSAIRE_ENTRIES_KEYS) {
        setSelectedEntry(GLOSSAIRE_ENTRIES_KEYS[key]);
      } else {
        setSelectedEntry(undefined);
      }
      onOpen();
    },
    [setSelectedEntry, onOpen]
  );

  return (
    <GlossaireContext.Provider
      value={{
        isOpen,
        selectedEntry,
        onOpen: onOpenCallback,
        onClose: onCloseCallback,
        setSelectedEntry,
      }}
    >
      {children}
    </GlossaireContext.Provider>
  );
}

export const useGlossaireContext = () => useContext(GlossaireContext);
