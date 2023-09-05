import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createIntentionsClient = (instance: AxiosInstance) => ({
  checkUai: createClientMethod<typeof ROUTES_CONFIG.checkUai>({
    method: "GET",
    url: ({ params }) => `/uai/${params.uai}/check`,
    instance,
  }),
  searchEtab: createClientMethod<typeof ROUTES_CONFIG.searchEtab>({
    method: "GET",
    url: ({ params }) => `/etab/search/${params.search}`,
    instance,
  }),
  checkCfd: createClientMethod<typeof ROUTES_CONFIG.checkCfd>({
    method: "GET",
    url: ({ params }) => `/cfd/${params.cfd}/check`,
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
});
