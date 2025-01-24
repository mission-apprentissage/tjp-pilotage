"use client";

import { redirect } from "next/navigation";
import { CODES_REGIONS_EXPE } from "shared/security/securityUtils";

import { useAuth } from "@/utils/security/useAuth";


const Page = () => {
  const { auth } = useAuth();
  const isPartOfExpe = CODES_REGIONS_EXPE.includes(auth?.user.codeRegion ?? "");

  return isPartOfExpe ? redirect("/intentions/perdir/saisie") : redirect("/intentions/saisie");
};
export default Page;
