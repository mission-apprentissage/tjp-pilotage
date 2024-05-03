"use client";

import { redirect } from "next/navigation";
import { hasRole } from "shared";

import { useAuth } from "@/utils/security/useAuth";

export default () => {
  const { auth } = useAuth();
  const isPerdir = hasRole({ user: auth?.user, role: "perdir" });

  isPerdir ? redirect("/intentions/perdir") : redirect("/intentions/saisie");
};
