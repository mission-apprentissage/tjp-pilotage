import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createIntentionsClient = (instance: AxiosInstance) => ({
  searchEtab: createClientMethod<typeof ROUTES_CONFIG.searchEtab>({
    method: "GET",
    url: ({ params }) => `/etab/search/${params.search}`,
    instance,
  }),
  getEtab: createClientMethod<typeof ROUTES_CONFIG.getEtab>({
    method: "GET",
    url: ({ params }) => `/etab/${params.uai}`,
    instance,
  }),
  searchDiplome: createClientMethod<typeof ROUTES_CONFIG.searchDiplome>({
    method: "GET",
    url: ({ params }) => `/diplome/search/${params.search}`,
    instance,
  }),
  submitDemande: createClientMethod<typeof ROUTES_CONFIG.submitDemande>({
    method: "POST",
    url: "/demande/submit",
    instance,
  }),
  submitDraftDemande: createClientMethod<
    typeof ROUTES_CONFIG.submitDraftDemande
  >({
    method: "POST",
    url: "/demande/draft",
    instance,
  }),
  getDemande: createClientMethod<typeof ROUTES_CONFIG.getDemande>({
    method: "GET",
    url: ({ params: { id } }) => `/demande/${id}`,
    instance,
  }),
  getDemandes: createClientMethod<typeof ROUTES_CONFIG.getDemandes>({
    method: "GET",
    url: "/demandes",
    instance,
  }),
  getDemandesCsv: createClientMethod<typeof ROUTES_CONFIG.getDemandesCsv>({
    method: "GET",
    url: "/demandes/csv",
    instance,
  }),
  countDemandes: createClientMethod<typeof ROUTES_CONFIG.countDemandes>({
    method: "GET",
    url: "/demandes/count",
    instance,
  }),
});
