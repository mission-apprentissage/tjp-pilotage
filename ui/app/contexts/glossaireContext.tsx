import { useDisclosure } from "@chakra-ui/hooks";
import { usePlausible } from "next-plausible";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  GLOSSAIRE_ENTRIES_KEYS,
  GlossaireEntryKey,
} from "../(wrapped)/glossaire/GlossaireEntries";

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
  const trackEvent = usePlausible();

  const onCloseCallback = useCallback(() => {
    setSelectedEntry(undefined);
    onClose();
  }, [onClose, setSelectedEntry]);

  const onOpenCallback = useCallback(
    (key: GlossaireEntryKey | undefined) => {
      if (key && key in GLOSSAIRE_ENTRIES_KEYS) {
        setSelectedEntry(GLOSSAIRE_ENTRIES_KEYS[key]);
        trackEvent("glossaire", { props: { entry: key } });
      } else {
        setSelectedEntry(undefined);
        trackEvent("glossaire", { props: { entry: "all" } });
      }
      onOpen();
    },
    [setSelectedEntry, onOpen]
  );

  const value = useMemo(
    () => ({
      isOpen,
      selectedEntry,
      onOpen: onOpenCallback,
      onClose: onCloseCallback,
      setSelectedEntry,
    }),
    [isOpen, selectedEntry, onOpenCallback, onCloseCallback, setSelectedEntry]
  );

  return (
    <GlossaireContext.Provider value={value}>
      {children}
    </GlossaireContext.Provider>
  );
}

export const useGlossaireContext = () => useContext(GlossaireContext);
