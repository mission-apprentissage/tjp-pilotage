"use client";

import { useContext } from "react";

import { CurrentCampagneContext } from "@/app/currentCampagneContext";

export const useCurrentCampagne = () => useContext(CurrentCampagneContext);
