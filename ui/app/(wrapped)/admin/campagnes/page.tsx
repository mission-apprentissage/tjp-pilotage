"use client";
import { redirect } from "next/navigation";
import { hasPermission } from "shared";

import { useAuth } from "@/utils/security/useAuth";

const Page = () => {

  const { auth }  = useAuth();
  const hasPermissionAdmin = hasPermission(auth?.user.role, "campagnes/ecriture");
  const hasPermissionCampagneRegion = hasPermission(auth?.user.role, "campagnes-région/lecture");

  if(hasPermissionAdmin) return redirect("/admin/campagnes/national");
  if(hasPermissionCampagneRegion) return redirect("/admin/campagnes/regional");
};

export default Page;

