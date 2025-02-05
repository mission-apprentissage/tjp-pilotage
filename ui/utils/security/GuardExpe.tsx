
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type {Role} from "shared";
import { RoleEnum } from "shared";
import type { CampagneType } from "shared/schema/campagneSchema";

import { isPerdirPartOfExpe, isUserPartOfExpe } from '@/utils/isPartOfExpe';

import { useAuth } from './useAuth';
import { useCurrentCampagne } from './useCurrentCampagne';


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

export const GuardExpe = ({ isExpeRoute, children }: { isExpeRoute: boolean; children: ReactNode }) => {
  const { auth } = useAuth();
  const { campagne } = useCurrentCampagne();
  const isPerdir = auth?.user.role === RoleEnum["perdir"];
  return isPerdir ?
    handlePerdir({ isExpeRoute, user: auth?.user, campagne, children }) :
    handleNotPerdir({ isExpeRoute, user: auth?.user, campagne, children });
};


/**
 *
 * Si l'utilisateur est un perdir (concerné par l'expérimentation) et que la route est concernée par l'expérimentation, on laisse passer
 * Si l'utilisateur est un perdir (concerné par l'expérimentation) et que la route n'est pas concernée par l'expérimentation, on redirige vers la page de saisie expérimentation
 * Si l'utilisateur n'est pas un perdir (concerné par l'expérimentation) on redirige vers l'accueil
 *
 */
const handlePerdir = ({
  isExpeRoute,
  user,
  campagne,
  children
}: {
  isExpeRoute: boolean;
  user?: {codeRegion?: string, role?: Role};
  campagne?: CampagneType;
  children: ReactNode
}) => {
  const isPartOfExpe = isPerdirPartOfExpe({ user, campagne });

  if(isExpeRoute) {
    return isPartOfExpe ? (<>{children}</>) : redirect("/");
  }
  return isPartOfExpe ? redirect("/intentions/perdir/saisie") : redirect("/");
};

/**
 *
 * Si l'utilisateur n'a pas de région d'affectation (utilisateur national), on laisse passer
 * Si l'utilisateur est dans une région concernée par l'expérimentation et que la route est concernée par l'expérimentation, on laisse passer
 * Si l'utilisateur n'est pas dans une région concernée par l'expérimentation et que la route n'est pas concernée par l'expérimentation, on laisse passer
 * Si l'utilisateur n'est pas dans une région concernée par l'expérimentation et que la route est concernée par l'expérimention, on redirige vers la page de saisie hors expérimentation
 * Si l'utilisateur est dans une région concernée par l'expérimentation et que la route n'est pas concernée par l'expérimentation, on redirige vers la page de saisie expérimentation
 *
 */
const handleNotPerdir = ({
  isExpeRoute,
  user,
  campagne,
  children
}: {
  isExpeRoute: boolean;
  user?: {
    codeRegion?: string,
    role?: Role
  };
  campagne?: CampagneType;
  children: ReactNode
}) => {
  if (!user?.codeRegion) return (<>{children}</>);
  const isPartOfExpe = isUserPartOfExpe({ user, campagne });

  if(isExpeRoute) {
    return isPartOfExpe ? (<>{children}</>) : redirect("/intentions/saisie");
  }
  return isPartOfExpe ? redirect("/intentions/perdir/saisie") : (<>{children}</>);
};
