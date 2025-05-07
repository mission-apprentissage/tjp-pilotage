import {Box, Button,chakra, CloseButton, Divider, Flex, Heading, Highlight, Stack, Text, Tooltip, VisuallyHidden} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import {useRouter, useSearchParams} from 'next/navigation';
import type { RefObject } from "react";
import { useState } from "react";
import {DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';

import { SCROLL_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";
import type { Demande } from '@/app/(wrapped)/demandes/types';
import { canCorrectDemande } from '@/app/(wrapped)/demandes/utils/permissionsDemandeUtils';
import {shouldDisplayAjustement} from '@/app/(wrapped)/demandes/utils/typeDemandeUtils';
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";
import {getRoutingSaisieDemande} from '@/utils/getRoutingDemande';
import {useAuth} from '@/utils/security/useAuth';

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";

const InfoAjustementSection = chakra(({ anneeCampagne }: { anneeCampagne: string }) => {
  const [open, setOpen] = useState(true);
  return (
    <Box
      backgroundColor={themeDefinition.colors.info[950]}
      color={themeDefinition.colors.info.text}
      width="100%"
      paddingY="12px"
      display={open ? "block" : "none"}
    >
      <Stack
        maxWidth={"container.xl"}
        margin="auto"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        flexWrap="nowrap"
        spacing="3"
        padding="4px 8px"
      >
        <Icon icon="ri:information-fill" fontSize="24px" />
        <Text
          flexGrow={1}
          fontSize={14}
          fontWeight={400}
          display={{
            base: "none",
            md: "block",
          }}
        >
          <Highlight
            query={`${anneeCampagne}`}
            styles={{
              color: "inherit",
              fontWeight: 700,
            }}
          >
            {`Pour apporter un ajustement à la rentrée scolaire ${anneeCampagne}, sélectionner ${anneeCampagne} dans le champ ci-dessus`}
          </Highlight>
        </Text>
        <CloseButton
          onClick={() => setOpen(false)}
          variant="inline"
          display="flex"
          padding="0"
          flexDirection="row"
          justifyItems="end"
          alignItems="start"
          width="auto"
          height="auto"
        >
          <VisuallyHidden fontSize={12}>Fermer</VisuallyHidden>
          <Icon icon="ri:close-fill" fontSize="24px" />
        </CloseButton>
      </Stack>
    </Box>
  );
});
export const TypeDemandeSection = ({
  disabled,
  demande,
  campagne,
  typeDemandeRef,
}: {
  disabled?: boolean;
  demande?: Demande;
  campagne: CampagneType;
  typeDemandeRef: RefObject<HTMLDivElement>;
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const queryParams = useSearchParams();
  const isCorrection = queryParams.get("correction")
   && canCorrectDemande({demande, user});

  return (
    <Flex ref={typeDemandeRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"} gap={6}>
      <Heading as="h2" fontSize="xl">
        <Flex direction={"row"} gap={3}>
          <Icon icon="ri:article-line" color="black" style={{ marginTop: "auto" }} />
          Type de demande
        </Flex>
      </Heading>
      <Divider />
      <RentreeScolaireField disabled={disabled} campagne={campagne} />
      {shouldDisplayAjustement(DemandeTypeEnum["ajustement"], user!) && (<InfoAjustementSection anneeCampagne={campagne.annee} />)}
      <TypeDemandeField disabled={disabled} campagne={campagne} />
      <Tooltip label="Pour transférer des places d’un établissement vers un autre, vous devez faire 2 demandes : une fermeture dans l’établissement initial, et une ouverture dans le nouvel établissement (plusieurs demandes d’ouverture si les places sont transférées à plusieurs établissements)">
        <Flex
          direction={"row"}
          gap={2}
          color={"bluefrance.113"}
          cursor={"pointer"}
          fontWeight={"700"}
          width={"fit-content"}
        >
          <TooltipIcon mt={"1"} />
          <Text>Vous cherchez à faire un transfert de places entre établissements ?</Text>
        </Flex>
      </Tooltip>
      <CapaciteSection disabled={disabled} />
      {isCorrection && (
        <Flex justify={"right"}>
          <Button
            w="fit-content"
            bgColor="transparent"
            border="1px solid black"
            onClick={() => {
              router.replace(
                getRoutingSaisieDemande({
                  user,
                  suffix: `${demande!.numero}?correction=true`,
                })
              );
            }}
          >
            {demande!.correction ? "Consulter la correction" : "Rectifier les capacités"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
