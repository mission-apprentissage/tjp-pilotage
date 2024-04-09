import { Divider, Heading } from "@chakra-ui/react";

import { CommentaireField } from "@/app/(wrapped)/intentions/saisie/intentionForm/observationsSection/CommentaireField";

export const ObservationsSection = ({ disabled }: { disabled: boolean }) => (
  <>
    <Heading as="h2" fontSize="xl" display={"flex"}>
      Observations sur la demande
    </Heading>
    <Divider pt="4" mb="4" />
    <CommentaireField disabled={disabled} maxW={752} />
  </>
);
