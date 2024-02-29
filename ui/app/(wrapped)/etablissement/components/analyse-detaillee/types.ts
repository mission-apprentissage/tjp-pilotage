import { client } from "@/api.client";

export type Formation =
  (typeof client.infer)["[GET]/etablissement/analyse-detaillee"]["formations"][string];

export type ChiffresIJ =
  (typeof client.infer)["[GET]/etablissement/analyse-detaillee"]["chiffresIj"][string];

export type ChiffresIJMillesime =
  (typeof client.infer)["[GET]/etablissement/analyse-detaillee"]["chiffresIj"][string][string];

export type ChiffresEntree =
  (typeof client.infer)["[GET]/etablissement/analyse-detaillee"]["chiffresEntree"][string];

export type ChiffresEntreeRentree =
  (typeof client.infer)["[GET]/etablissement/analyse-detaillee"]["chiffresEntree"][string][string];
