"use client";

import { redirect } from "next/navigation";
import { hasRole } from "shared";
import { CODES_REGIONS_EXPE } from "shared/security/securityUtils";

import { useAuth } from "@/utils/security/useAuth";

export default () => {
  const { auth } = useAuth();
  const isPerdir = hasRole({
    user: auth?.user,
    role: "perdir",
  });
  // Feature flag pour les perdir de la région Occitanie (76) et AURA (84)
  // qui font partie du test
  const FF_isPerdirPartOfExpe =
    isPerdir && CODES_REGIONS_EXPE.includes(auth?.user.codeRegion ?? "");

  FF_isPerdirPartOfExpe
    ? redirect("/intentions/perdir")
    : redirect("/intentions/ra");
};
