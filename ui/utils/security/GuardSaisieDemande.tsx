"use client";

import { redirect, } from "next/navigation";
import type { ReactNode } from "react";
import {hasRole, RoleEnum} from 'shared';
import type { CampagneType } from "shared/schema/campagneSchema";
import {isUserNational} from 'shared/security/securityUtils';
import { isCampagneEnCours } from "shared/utils/campagneUtils";

import {feature} from '@/utils/feature';
import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { isUserPartOfSaisieDemande} from '@/utils/isPartOfSaisieDemande';

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
  if(feature.saisieDisabled) return redirect(getRoutingAccessSaisieDemande({ user, campagne }));
  if(!isUserPartOfSaisieDemande({ user, campagne })) return redirect(getRoutingAccessSaisieDemande({ user, campagne }));
  if(isUserNational({ user }) && isCampagneEnCours(campagne)) return (<>{children}</>);
  const isCampagneRegionale = !!campagne?.codeRegion;
  const withSaisiePerdir = (hasRole({ user, role: RoleEnum["perdir"] }) && isCampagneRegionale) ? !!campagne?.withSaisiePerdir : true;
  if(!withSaisiePerdir) return redirect(getRoutingAccessSaisieDemande({ user, campagne }));
  return (<>{children}</>);
};
