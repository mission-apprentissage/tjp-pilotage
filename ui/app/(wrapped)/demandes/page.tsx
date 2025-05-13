"use client";

import { redirect } from "next/navigation";

import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

const Page = () => {
  const { user } = useAuth();
  const { campagne } = useCurrentCampagne();

  redirect(getRoutingAccessSaisieDemande({ user, campagne }));
};
export default Page;
