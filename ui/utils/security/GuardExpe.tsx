"use client";

import {redirect,} from 'next/navigation';
import type { ReactNode } from "react";
import {CODES_REGIONS_EXPE} from 'shared/security/securityUtils';

import {useAuth} from './useAuth';

/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à l'expérimentation perdir ou non
 *
 * Si l'utilisation n'a pas de région d'affectation (utilisateur national), on laisse passer
 * Si l'utilisateur est dans une région concernée par l'expérimentation et que la route est concernée par l'expérimentation, on laisse passer
 * Si l'utilisateur n'est pas dans une région concernée par l'expérimentation et que la route n'est pas concernée par l'expérimentation, on laisse passer
 * Si l'utilisateur n'est pas dans une région concernée par l'expérimentation et que la route est concernée par l'expérimention, on redirige vers la page de saisie hors expérimentation
 * Si l'utilisateur est dans une région concernée par l'expérimentation et que la route n'est pas concernée par l'expérimentation, on redirige vers la page de saisie expérimentation
 *
 * @param isExpeRoute est-ce que la route est concernée par l'expérimentation perdir
 * @returns
 */

export const GuardExpe = ({ isExpeRoute, children }: { isExpeRoute: boolean; children: ReactNode }) => {
  const { auth } = useAuth();
  if (!auth?.user.codeRegion) return (<>{children}</>);

  const isPartOfExpe = auth?.user.codeRegion && CODES_REGIONS_EXPE.includes(auth?.user.codeRegion ?? "");

  if (isPartOfExpe && isExpeRoute) return (<>{children}</>);
  if (!isPartOfExpe && !isExpeRoute) return (<>{children}</>);
  if (isPartOfExpe && !isExpeRoute) return redirect("/intentions/perdir/saisie");
  if (!isPartOfExpe && isExpeRoute) return redirect("/intentions/saisie");
};
