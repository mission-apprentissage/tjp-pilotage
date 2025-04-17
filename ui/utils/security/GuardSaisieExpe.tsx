"use client";

import { redirect, } from "next/navigation";
import type { ReactNode } from "react";
import {hasRole, RoleEnum} from 'shared';
import type { CampagneType } from "shared/schema/campagneSchema";
import {isUserNational} from 'shared/security/securityUtils';
import { isCampagneEnCours } from "shared/utils/campagneUtils";

import {feature} from '@/utils/feature';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { isUserPartOfExpe } from "@/utils/isPartOfExpe";

import { useAuth } from './useAuth';

/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à la saisie de l'expérimentation perdir ou non
 *
 * @param isExpeRoute est-ce que la route est concernée par l'expérimentation perdir
 * @returns
 */

export const GuardSaisieExpe = ({ campagne, children }: { campagne: CampagneType; children: ReactNode }): ReactNode => {
  const { user } = useAuth();
  if(feature.saisieDisabled) return redirect(getRoutingSaisieRecueilDemande({ user }));
  if(!isUserPartOfExpe({ user, campagne })) return redirect(getRoutingSaisieRecueilDemande({ user }));
  if(isUserNational({ user }) && isCampagneEnCours(campagne)) return (<>{children}</>);
  const isCampagneRegionale = !!campagne?.codeRegion;
  const withSaisiePerdir = (hasRole({ user, role: RoleEnum["perdir"] }) && isCampagneRegionale) ? !!campagne?.withSaisiePerdir : true;
  if(!withSaisiePerdir) return redirect(getRoutingSaisieRecueilDemande({ user }));
  return (<>{children}</>);
};
