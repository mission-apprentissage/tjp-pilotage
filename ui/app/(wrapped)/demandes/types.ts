import type { client } from "@/api.client";

export type Demande = (typeof client.infer)["[GET]/demande/:numero"];
export type FileType = (typeof client.infer)["[GET]/demande/:numero/files"]["files"][number];

export type DemandeMetadata = Demande["metadata"];

export type ChangementsStatut = Demande["changementsStatut"];
export type Aviss = Demande["avis"];

export type ChangementStatut = Exclude<ChangementsStatut, typeof undefined>[number];

export type Avis = Exclude<Aviss, typeof undefined>[number];

export type Disciplines = (typeof client.infer)["[GET]/discipline/search/:search"];
export type Discipline = Disciplines[number];
export type Etablissements = (typeof client.infer)["[GET]/etablissement/perdir/search/:search"];
export type Etablissement = Etablissements[number];
export type Formations = (typeof client.infer)["[GET]/diplome/search/:search"];
export type Formation = Formations[number];
export type Filieres = (typeof client.infer)["[GET]/filiere/search/:search"];
export type Filiere = Filieres[number];
export type Campuss = (typeof client.infer)["[GET]/campus/search/:search"];
export type Campus = Campuss[number];
