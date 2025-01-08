// eslint-disable-next-line import/no-extraneous-dependencies
import { useDisclosure } from "@chakra-ui/hooks";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { GlossaireEntryKey } from "./GlossaireEntries";
import { GLOSSAIRE_ENTRIES_KEYS } from "./GlossaireEntries";
import type { GlossaireEntries } from "./types";

type GlossaireContextType = {
  isOpen: boolean;
  openGlossaire: (key?: GlossaireEntryKey) => void;
  closeGlossaire: () => void;
  selectedEntry?: string;
  setSelectedEntry: (id?: string) => void;
  entries: GlossaireEntries;
};

export const GlossaireContext = createContext<GlossaireContextType>({} as GlossaireContextType);

export function GlossaireProvider({
  children,
  initialEntries,
}: {
  children: React.ReactNode;
  initialEntries: GlossaireEntries;
}) {
  const [entries] = useState<GlossaireEntries>(initialEntries);
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
    [setSelectedEntry, onOpen],
  );

  const value = useMemo(
    () => ({
      isOpen,
      selectedEntry,
      openGlossaire: onOpenCallback,
      closeGlossaire: onCloseCallback,
      setSelectedEntry,
      entries,
    }),
    [isOpen, selectedEntry, onOpenCallback, onCloseCallback, setSelectedEntry],
  );

  return <GlossaireContext.Provider value={value}>{children}</GlossaireContext.Provider>;
}

export const useGlossaireContext = () => useContext(GlossaireContext);
