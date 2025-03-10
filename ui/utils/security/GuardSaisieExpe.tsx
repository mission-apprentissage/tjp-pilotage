"use client";

import { redirect, usePathname, } from "next/navigation";
import type { ReactNode } from "react";
import {hasRole, RoleEnum} from 'shared';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {isUserNational} from 'shared/security/securityUtils';
import { isCampagneEnCours } from "shared/utils/campagneUtils";

import {feature} from '@/utils/feature';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { isUserPartOfExpe } from "@/utils/isPartOfExpe";

import { useAuth } from './useAuth';


/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à l'expérimentation perdir ou non
 *
 * Si l'utilisateur est un perdir on applique les règles liées aux PERDIR
 * Si l'utilisateur n'est pas un perdir on applique les règles liées aux autres utilisateurs
 *
 * @param isExpeRoute est-ce que la route est concernée par l'expérimentation perdir
 * @returns
 */

export const GuardSaisieExpe = ({ campagne, children }: { campagne: CampagneType; children: ReactNode }): ReactNode => {
  const pathname = usePathname();
  const segment = pathname ? pathname.split("/").pop() : undefined;
  const { user } = useAuth();

  if(!isUserPartOfExpe({ user, campagne })) return redirect(getRoutingSaisieRecueilDemande({ campagne, user }));
  return segment?.startsWith("new") ?
    handleNewSaisie({ campagne, user, children }) :
    handleEditSaisie({ campagne, user, children });
};

const handleNewSaisie = (
  { campagne, user, children }:
  { campagne: CampagneType; user?: UserType; children: ReactNode }
): ReactNode => {
  if(isUserNational({ user }) && isCampagneEnCours(campagne)) return (<>{children}</>);
  const isCampagneRegionale = !!campagne?.codeRegion;
  const withSaisiePerdir = hasRole({ user, role: RoleEnum["perdir"] }) ? !!campagne?.withSaisiePerdir : true;

  if (feature.saisieDisabled ||
    !isCampagneRegionale ||
    !withSaisiePerdir
  ) return redirect(getRoutingSaisieRecueilDemande({ campagne, user }));
  return (<>{children}</>);
};

const handleEditSaisie = (
  { campagne, user, children }:
  { campagne: CampagneType; user?: UserType; children: ReactNode }
): ReactNode => {
  if(isUserNational({ user })) return isCampagneEnCours(campagne) ?
    (<>{children}</>) :
    redirect(getRoutingSaisieRecueilDemande({ campagne, user }));
  const isCampagneRegionale = !!campagne?.codeRegion;
  const withSaisiePerdir = (hasRole({ user, role: RoleEnum["perdir"] }) && isCampagneRegionale) ? !!campagne?.withSaisiePerdir : true;

  if(
    feature.saisieDisabled ||
    !withSaisiePerdir
  ) return redirect(getRoutingSaisieRecueilDemande({ campagne, user }));
  return (<>{children}</>);
};
