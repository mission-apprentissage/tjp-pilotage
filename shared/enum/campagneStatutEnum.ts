import { z } from "zod";

export const campagneStatut = z.enum(["en cours", "en attente", "terminée"]);

export const CampagneStatutEnum = campagneStatut.Enum;

export type CampagneStatut = z.infer<typeof campagneStatut>;
