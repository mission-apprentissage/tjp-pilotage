import type { client } from "@/api.client";

export type Demande = (typeof client.infer)["[GET]/demande/:numero"];
export type DemandeMetadata = Demande["metadata"];

export type ChangementsStatut = Demande["changementsStatut"];
export type Aviss = Demande["avis"];

export type ChangementStatut = Exclude<ChangementsStatut, typeof undefined>[number];

export type Avis = Exclude<Aviss, typeof undefined>[number];

export type Discipline = (typeof client.infer)["[GET]/discipline/search/:search"][number];
export type Etablissement = (typeof client.infer)["[GET]/etablissement/perdir/search/:search"][number];
export type Formation = (typeof client.infer)["[GET]/diplome/search/:search"][number];
