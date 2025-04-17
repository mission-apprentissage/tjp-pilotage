"use client";

import { redirect } from "next/navigation";

import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";


const Page = () => {
  const { user } = useAuth();

  redirect(getRoutingSaisieRecueilDemande({user})
  );
};
export default Page;
