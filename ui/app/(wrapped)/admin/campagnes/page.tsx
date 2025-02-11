"use client";
import { redirect } from "next/navigation";
import { hasPermission } from "shared";

import { useAuth } from "@/utils/security/useAuth";

const Page = () => {

  const { role }  = useAuth();
  const hasPermissionAdmin = hasPermission(role, "campagnes/ecriture");
  const hasPermissionCampagneRegion = hasPermission(role, "campagnes-région/lecture");

  if(hasPermissionAdmin) return redirect("/admin/campagnes/national");
  if(hasPermissionCampagneRegion) return redirect("/admin/campagnes/regional");
};

export default Page;

