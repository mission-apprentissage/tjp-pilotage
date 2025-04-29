"use client";

import { redirect } from "next/navigation";

import { getRoutingSaisieDemande } from "@/utils/getRoutingDemande";
import { useAuth } from "@/utils/security/useAuth";

const Page = () => {
  const { user } = useAuth();

  redirect(getRoutingSaisieDemande({user}));
};
export default Page;
