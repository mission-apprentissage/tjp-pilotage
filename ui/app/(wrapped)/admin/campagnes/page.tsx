"use client";
import { redirect } from "next/navigation";
import { hasPermission } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import { useAuth } from "@/utils/security/useAuth";

const Page = () => {
  const { role }  = useAuth();
  const hasPermissionAdmin = hasPermission(role, PermissionEnum["campagnes/ecriture"]);
  const hasPermissionCampagneRegion = hasPermission(role, PermissionEnum["campagnes-région/lecture"]);

  if(hasPermissionAdmin) return redirect("/admin/campagnes/national");
  if(hasPermissionCampagneRegion) return redirect("/admin/campagnes/regional");
};

export default Page;

