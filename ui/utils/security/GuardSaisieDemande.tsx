"use client";

import { redirect, } from "next/navigation";
import type { ReactNode } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { canCreateDemande } from "@/utils/permissionsDemandeUtils";

import { useAuth } from './useAuth';

/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à la saisie ou non
 *
 * @returns
 */

export const GuardSaisieDemande = (
  { campagne, children }:
  { campagne: CampagneType; children: ReactNode }
): ReactNode => {
  const { user } = useAuth();
  if(canCreateDemande({ user, campagne })) return (<>{children}</>);
  return redirect(getRoutingAccessSaisieDemande({ user, campagne }));
};
