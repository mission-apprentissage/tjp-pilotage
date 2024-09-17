import { HStack, Tag, Text, Tooltip, VStack } from "@chakra-ui/react";
import { AvisStatutType } from "shared/enum/avisStatutEnum";
import { AvisTypeType } from "shared/enum/avisTypeEnum";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import {
  getStepWorkflow,
  getStepWorkflowAvis,
} from "../../../utils/statutUtils";
import {
  getAvisStatusTagBgColor,
  getAvisStatusTagTextColor,
  TagIcon,
} from "../../components/AvisStatutTag";
import { Avis } from "../types";

export const AvisTags = ({
  listeAvis,
  statut,
}: {
  listeAvis: Avis[];
  statut: DemandeStatutType;
}) => {
  return (
    <HStack gap={3}>
      {listeAvis
        .filter(
          (avis) =>
            getStepWorkflowAvis(avis.type as AvisTypeType) ===
            getStepWorkflow(statut)
        )
        .sort((a, b) => a.fonction!.localeCompare(b.fonction!))
        .map((avis) => (
          <Tooltip
            key={avis.id}
            label={
              <VStack alignItems={"start"}>
                <Text>Avis {avis.statut}</Text>
                {avis.commentaire && (
                  <Text _firstLetter={{ textTransform: "uppercase" }}>
                    {avis.commentaire}
                  </Text>
                )}
              </VStack>
            }
          >
            <Tag
              size={"md"}
              color={getAvisStatusTagTextColor(avis.statut as AvisStatutType)}
              bgColor={getAvisStatusTagBgColor(avis.statut as AvisStatutType)}
              gap={1}
            >
              {<TagIcon statutAvis={avis.statut as AvisStatutType} />}
              {avis.fonction?.toUpperCase()}
            </Tag>
          </Tooltip>
        ))}
    </HStack>
  );
};
