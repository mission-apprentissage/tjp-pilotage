"use client";

import { redirect, } from "next/navigation";
import type { ReactNode } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import type { Demande } from "@/utils/permissionsDemandeUtils";
import { canCreateDemande, canEditDemande, canEditDemandeCfdUai } from "@/utils/permissionsDemandeUtils";

import { useAuth } from './useAuth';

/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à la saisie ou non
 *
 * @returns
 */

export const GuardSaisieDemande = (
  { campagne, demande, children }:
  { campagne: CampagneType; demande?: Demande; children: ReactNode }
): ReactNode => {
  const { user } = useAuth();
  if (demande) {
    if (canEditDemande({ demande, user }) || canEditDemandeCfdUai({ demande, user }))
      return (<>{children}</>);
  }
  if(canCreateDemande({ user, campagne })) return (<>{children}</>);
  return redirect(getRoutingAccessSaisieDemande({ user, campagne }));
};
