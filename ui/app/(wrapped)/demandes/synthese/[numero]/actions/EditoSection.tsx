"use client";

import { LinkIcon } from "@chakra-ui/icons";
import { Button, chakra, Divider, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

import { STICKY_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";
import { useAuth } from "@/utils/security/useAuth";

interface IEdito {
  message?: string,
  titre?: string,
  lien?: string,
  en_ligne?: boolean,
  date_creation?: Date,
  order?: number,
  region?: string,
}

const EDITO: IEdito[] = [
  {
    "titre": "Webinaires à venir",
    "en_ligne": false,
    message: "Pour accompagner votre découverte d’Orion, des webinaires sont organisés le mercredi à 12h15 .",
    lien: "https://webinaire.numerique.gouv.fr//meeting/signin/31852/creator/16468/hash/6d52a428a84100623dbff7e34ff7843f4a0c9f0f",
    date_creation: new Date("2024-06-11"),
    region: "",
    order: 1
  },
  {
    "titre": "Webinaires à venir",
    "en_ligne": true,
    message: "Pour accompagner votre saisie en AURA et Occitanie, des webinaires sont organisés le mercredi à 15 heures.",
    lien: "https://webinaire.numerique.gouv.fr//meeting/signin/31852/creator/16468/hash/6d52a428a84100623dbff7e34ff7843f4a0c9f0f",
    date_creation: new Date("2024-06-11"),
    region: "76",
    order: 1
  },
  {
    "titre": "Webinaires à venir",
    "en_ligne": true,
    message: "Pour accompagner votre saisie en AURA et Occitanie, des webinaires sont organisés le mercredi à 15 heures.",
    lien: "https://webinaire.numerique.gouv.fr//meeting/signin/31852/creator/16468/hash/6d52a428a84100623dbff7e34ff7843f4a0c9f0f",
    date_creation: new Date("2024-07-05"),
    region: "84",
    order: 1
  },
  {
    "titre": "Communauté M@gistere",
    "en_ligne": false,
    message: "Afin de vous permettre d’échanger, de vous renseigner….",
    lien: "",
    date_creation: new Date("2024-06-11"),
    region: "",
    order: 2
  }
];

export const EditoSection = chakra(() => {
  if (EDITO.length === 0) return <></>;

  const auth = useAuth();

  const normalizedEdito = EDITO
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((entry) => entry.en_ligne)
    .filter((entry) => {
      if (!entry.region) return true;
      if (entry.region === auth.codeRegion) return true;
      return false;
    });


  return (
    <Flex direction={"column"} gap={4} bgColor={"white"} borderRadius={6} p={6} top={STICKY_OFFSET} position={"sticky"}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Actualités
      </Heading>
      <Divider />
      {normalizedEdito.map((rowEdito, index) => {
        return (
          <Flex direction={"column"} gap={2} key={rowEdito.titre}>
            <Heading as="h3" fontSize={16} fontWeight={700} color={"grey.425"} textTransform={"uppercase"}>
              {rowEdito.titre}
            </Heading>
            <Heading as="h4" fontSize={14} fontWeight={400}>
              {rowEdito.message}
            </Heading>
            {rowEdito.lien && (
              <Button
                as={NextLink}
                href={rowEdito.lien}
                variant={"externalLink"}
                leftIcon={<LinkIcon />}
                textDecoration={"underline"}
              >
                Ouvrir le lien
              </Button>
            )}
            {EDITO.length - 1 !== index && <Divider />}
          </Flex>
        );
      })}
    </Flex>
  );
});
