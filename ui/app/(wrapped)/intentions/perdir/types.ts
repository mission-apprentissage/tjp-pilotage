import type { client } from "@/api.client";

export type Intention = (typeof client.infer)["[GET]/intention/:numero"];
export type IntentionMetadata = Intention["metadata"];

export type ChangementsStatut = Intention["changementsStatut"];
export type Aviss = Intention["avis"];

export type ChangementStatut = Exclude<ChangementsStatut, typeof undefined>[number];

export type Avis = Exclude<Aviss, typeof undefined>[number];
