import { Avatar, chakra,Checkbox, Flex, HStack, IconButton, Tag, Td, Text, Tooltip, useToast, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { TypeAvisType } from "shared/enum/typeAvisEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import { isCampagneTerminee } from "shared/utils/campagneUtils";

import { client } from "@/api.client";
import { StatutTag } from "@/app/(wrapped)/demandes/components/StatutTag";
import { AvisTags } from "@/app/(wrapped)/demandes/saisie/components/AvisTags";
import { DeleteDemandeButton } from "@/app/(wrapped)/demandes/saisie/components/DeleteDemandeButton";
import { ModificationDemandeButton } from "@/app/(wrapped)/demandes/saisie/components/ModificationDemandeButton";
import { ProgressSteps } from "@/app/(wrapped)/demandes/saisie/components/ProgressSteps";
import type { DEMANDES_COLUMNS_OPTIONAL } from "@/app/(wrapped)/demandes/saisie/DEMANDES_COLUMNS";
import type { CheckedDemandesType } from "@/app/(wrapped)/demandes/saisie/page.client";
import type { Demande, DEMANDES_COLUMNS_KEYS } from "@/app/(wrapped)/demandes/saisie/types";
import { getStepWorkflow, getStepWorkflowAvis } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";
import type { DetailedApiError} from "@/utils/apiError";
import { getDetailedErrorMessage } from "@/utils/apiError";
import { formatCodeDepartement, formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { getRoutingAccessSaisieDemande, getRoutingAccesSyntheseDemande } from "@/utils/getRoutingAccesDemande";
import { canCheckDemande, canDeleteDemande, canEditDemande, canImportDemande } from "@/utils/permissionsDemandeUtils";

import { getLeftOffset, isColonneSticky, isColonneVisible } from "./utils";

const getAvatarBgColor = (userName: string) => {
  const colors = [
    "#958b62",
    "#91ae4f",
    "#169b62",
    "#466964",
    "#00Ac8c",
    "#5770be",
    "#484d7a",
    "#ff8d7e",
    "#ffc29e",
    "#ffe800",
    "#fdcf41",
    "#ff9940",
    "#e18b63",
    "#ff6f4c",
    "#8586F6",
  ];
  return colors[userName.charCodeAt(1) % colors.length];
};

const ConditionalTd = chakra(
  ({
    className,
    colonneFilters,
    colonne,
    stickyColonnes,
    getCellBgColor,
    children,
    isNumeric = false,
  }: {
    className?: string;
    colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
    colonne: DEMANDES_COLUMNS_KEYS;
    stickyColonnes: Array<DEMANDES_COLUMNS_KEYS>;
    getCellBgColor: (column: DEMANDES_COLUMNS_KEYS) => string;
    children: React.ReactNode;
    isNumeric?: boolean;
  }) => {
    const isVisible = isColonneVisible({ colonne, colonneFilters });
    const isSticky = isColonneSticky({ colonne, stickyColonnes });
    if (isVisible)
      return (
        <Td
          className={className}
          isNumeric={isNumeric}
          whiteSpace={"normal"}
          _groupHover={{ bgColor: "blueecume.850 !important" }}
          bgColor={getCellBgColor(colonne)}
          left={getLeftOffset({ colonne, stickyColonnes, colonneFilters })}
          zIndex={isSticky ? 2 : undefined}
          boxShadow={{
            lg: "none",
            xl: "inset -1px 0px 0px 0px #f6f6f6",
          }}
          position={{
            lg: "static",
            xl: isSticky ? "sticky" : "static",
          }}
        >
          {children}
        </Td>
      );
    return null;
  }
);

export const LineContent = ({
  user,
  demande,
  campagne,
  currentCampagne,
  canCheckDemandes,
  checkedDemandes,
  onChangeCheckedDemandes,
  setStatut,
  isLoading,
  colonneFilters,
  stickyColonnes,
  getCellBgColor
}: {
  user?: UserType;
  demande: Demande;
  campagne: CampagneType;
  currentCampagne?: CampagneType;
  canCheckDemandes: boolean;
  checkedDemandes: CheckedDemandesType | undefined;
  onChangeCheckedDemandes: (demande: { statut: DemandeStatutType, numero: string }) => void;
  setStatut: (statut: DemandeStatutType | undefined) => void;
  isLoading?: boolean;
  colonneFilters: (keyof typeof DEMANDES_COLUMNS_OPTIONAL)[];
  stickyColonnes: DEMANDES_COLUMNS_KEYS[];
  getCellBgColor: (column: keyof typeof DEMANDES_COLUMNS_OPTIONAL) => string;
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const bluefrance113 = useToken("colors", "bluefrance.113");

  const { mutateAsync: importDemande, isLoading: isSubmitting } = client
    .ref("[POST]/demande/import/:numero")
    .useMutation({
      onSuccess: (demande) => {
        router.push(getRoutingAccessSaisieDemande({ user, campagne: currentCampagne, suffix: demande.numero }));
      },
      onError: (error) => {
        if(isAxiosError<DetailedApiError>(error)) {
          toast({
            variant: "left-accent",
            status: "error",
            title: Object.values(getDetailedErrorMessage(error) ?? {}).join(", ") ?? "Une erreur est survenue lors de l'import de la demande",
          });
        }
        setIsImporting(false);
      },
    });

  const { mutate: submitSuivi } = client.ref("[POST]/demande/suivi").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été ajoutée à vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/demandes"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/demandes/count"],
        });
      }, 500);
    },
  });

  const { mutate: deleteSuivi } = client.ref("[DELETE]/demande/suivi/:id").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été supprimée de vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/demandes"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/demandes/count"],
        });
      }, 500);
    },
  });

  const linkSaisieImported = getRoutingAccessSaisieDemande({
    user,
    campagne: campagne,
    suffix: demande.numeroDemandeImportee
  });

  const linkSynthese = getRoutingAccesSyntheseDemande({
    user,
    campagne: campagne,
    suffix: demande.numero
  });

  const isModificationDisabled = !canEditDemande({
    demande : {
      ...demande,
      campagne,
    },
    user,
  });

  const isDeleteDisabled = !canDeleteDemande({
    demande : {
      ...demande,
      campagne,
    },
    user
  });

  const isImportDisabled = !canImportDemande({
    isAlreadyImported: !!demande.numeroDemandeImportee,
    isLoading: (isLoading || isSubmitting || isImporting),
    user,
    campagne: campagne,
  });

  const isChecked = checkedDemandes !== undefined &&
  checkedDemandes.demandes.length > 0 &&
  checkedDemandes.demandes.includes(demande.numero);
  const canBeChecked = canCheckDemande({
    demande: {
      ...demande,
      campagne: campagne
    },
    checkedDemandes,
    user
  });

  return (
    <>
      {canCheckDemandes && (
        <Td textAlign={"center"}>
          <Tooltip isDisabled={canBeChecked}
            closeOnScroll={true}
            label={
              isModificationDisabled ?
                "Cette demande a un statut qui ne permet pas sa sélection pour modification." :
                "Vous avez sélectionné une demande dont le statut est différent, ce qui ne permet pas de modifier le statut de manière groupée."}
            shouldWrapChildren
          >
            <Checkbox
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeCheckedDemandes(demande);
              }}
              borderRadius={4}
              borderColor={"bluefrance.113"}
              bgColor={"white"}
              _checked={{
                bgColor: "bluefrance.113",
              }}
              colorScheme="bluefrance"
              iconColor={"white"}
              isChecked={isChecked}
              isDisabled={!canBeChecked}
            />
          </Tooltip>
        </Td>
      )}
      <ConditionalTd
        colonne={"updatedAt"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign={"center"}
      >
        <Tooltip label={`Le ${format(demande.updatedAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
          {format(demande.updatedAt, "d MMM HH:mm", {
            locale: fr,
          })}
        </Tooltip>
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleFormation"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <Tooltip label={demande.libelleFormation}>
          <Text
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            whiteSpace={"break-spaces"}
            noOfLines={2}
          >
            {demande.libelleFormation}
          </Text>
        </Tooltip>
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleEtablissement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <Tooltip label={demande.libelleEtablissement}>
          <Text
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            whiteSpace={"break-spaces"}
            noOfLines={2}
          >
            {demande.libelleEtablissement}
          </Text>
        </Tooltip>
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleDepartement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <Text
          textAlign={"center"}
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          whiteSpace={"break-spaces"}
          noOfLines={2}
        >
          <Tooltip
            label={formatDepartementLibelleWithCodeDepartement({
              libelleDepartement: demande.libelleDepartement,
              codeDepartement: demande.codeDepartement,
            })}
          >
            {formatCodeDepartement(demande.codeDepartement)}
          </Tooltip>
        </Text>
      </ConditionalTd>
      <ConditionalTd
        colonne={"statut"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign={"center"}
      >
        <StatutTag statut={demande.statut} size="md" />
      </ConditionalTd>
      <ConditionalTd
        colonne={"actions"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign={"center"}
      >
        <Flex direction={"row"} gap={0} justifyContent={"left"}>
          <Tooltip label="Voir la demande" shouldWrapChildren>
            <IconButton
              as={NextLink}
              href={linkSynthese}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(linkSynthese);
              }}
              aria-label="Voir la demande"
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={<Icon icon="ri:eye-line" width={"24px"} color={bluefrance113} />}
            />
          </Tooltip>
          <ModificationDemandeButton
            user={user}
            demande={demande}
            campagne={campagne}
            onChangeCheckedDemandes={onChangeCheckedDemandes}
            setStatut={setStatut}
          />
          {!isDeleteDisabled && (<DeleteDemandeButton demande={demande} />) }
          <Tooltip label="Suivre la demande" shouldWrapChildren>
            <IconButton
              onClick={() => {
                if (!demande.suiviId)
                  submitSuivi({
                    body: {
                      demandeNumero: demande.numero,
                    },
                  });
                else
                  deleteSuivi({
                    params: { id: demande.suiviId },
                  });
              }}
              aria-label="Suivre la demande"
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={
                demande.suiviId ? (
                  <Icon width="24px" icon="ri:bookmark-fill" />
                ) : (
                  <Icon width="24px" icon="ri:bookmark-line" />
                )
              }
            />
          </Tooltip>
          {isCampagneTerminee(campagne) &&
        (demande.numeroDemandeImportee ? (
          <Tooltip label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`} shouldWrapChildren>
            <IconButton
              as={NextLink}
              href={linkSaisieImported}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(linkSaisieImported);
              }}
              aria-label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`}
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={<Icon icon="ri:external-link-line" width={"24px"} color={bluefrance113} />}
            />
          </Tooltip>
        ) : (
          <Tooltip label={"Dupliquer la demande"} shouldWrapChildren>
            <IconButton
              onClick={(e) => {
                if(isImportDisabled) return;
                setIsImporting(true);
                e.preventDefault();
                e.stopPropagation();
                importDemande({
                  params: {
                    numero: demande.numero,
                  },
                });
              }}
              isDisabled={isImportDisabled}
              aria-label="Dupliquer la demande"
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={<Icon icon="ri:file-copy-line" width={"24px"} color={bluefrance113} />}
            />
          </Tooltip>
        ))}
        </Flex>
      </ConditionalTd>
      <ConditionalTd
        colonne={"typeDemande"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign={"center"}
      >
        <Tag colorScheme="blue" size={"md"} h="fit-content">
          {getTypeDemandeLabel(demande.typeDemande)}
        </Tag>
      </ConditionalTd>
      <ConditionalTd
        colonne={"createdAt"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign={"center"}
      >
        <Tooltip label={`Le ${format(demande.createdAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
          {format(demande.createdAt, "d MMM HH:mm", {
            locale: fr,
          })}
        </Tooltip>
      </ConditionalTd>
      <ConditionalTd
        colonne={"numero"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <Text
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          whiteSpace={"break-spaces"}
          textAlign={"center"}
        >
          {demande.numero}
        </Text>
      </ConditionalTd>
      <ConditionalTd
        colonne={"userName"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign={"center"}
      >
        <Tooltip label={demande.userName}>
          <Avatar
            name={demande.userName}
            colorScheme={getAvatarBgColor(demande.userName ?? "")}
            bg={getAvatarBgColor(demande.userName ?? "")}
            color={"white"}
            position={"unset"}
          />
        </Tooltip>
      </ConditionalTd>
      <ConditionalTd
        colonne={"inspecteurReferent"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <Text textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"break-spaces"}>
          {demande.inspecteurReferent}
        </Text>
      </ConditionalTd>
      <ConditionalTd
        colonne={"statut"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <ProgressSteps statut={demande.statut} />
      </ConditionalTd>
      <ConditionalTd
        colonne={"avisPhaseEnCours"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <HStack w={"100%"} justify={"center"}>
          <Tag size="md" color={"white"} bgColor={"bluefrance.525"} fontWeight={"bold"}>
            {
              demande.avis.filter(
                (avis) =>
                  getStepWorkflowAvis(avis.type as TypeAvisType) ===
                getStepWorkflow(demande.statut)
              ).length
            }
          </Tag>
          <Text>({demande.avis.length} au total)</Text>
        </HStack>
      </ConditionalTd>
      <ConditionalTd
        colonne={"derniersAvisPhaseEnCours"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <AvisTags listeAvis={demande.avis} statut={demande.statut} />
      </ConditionalTd>
    </>
  );
};
