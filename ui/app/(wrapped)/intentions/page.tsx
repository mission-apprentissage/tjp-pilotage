"use client";

import { redirect } from "next/navigation";
import { CODES_REGIONS_EXPE } from "shared/security/securityUtils";

import { useAuth } from "@/utils/security/useAuth";

import { useRole } from "../../../utils/security/useRole";

export default () => {
  const { auth } = useAuth();
  const isPerdir = useRole("perdir");
  // Feature flag pour les perdir de la région Occitanie (76) et AURA (84)
  // qui font partie du test
  const FF_isPerdirPartOfExpe =
    isPerdir && CODES_REGIONS_EXPE.includes(auth?.user.codeRegion ?? "");

  FF_isPerdirPartOfExpe
    ? redirect("/intentions/perdir")
    : redirect("/intentions/saisie");
};
