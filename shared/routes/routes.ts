import { deleteCampagneRegionSchema } from "./schemas/delete.campagneRegion.id.schema";
import { deleteAvisSchema } from "./schemas/delete.demande.avis.id.schema";
import { deleteDemandeFilesSchema } from "./schemas/delete.demande.numero.files.schema";
import { deleteDemandeSchema } from "./schemas/delete.demande.numero.schema";
import { deleteChangementStatutSchema } from "./schemas/delete.demande.statut.id.schema";
import { deleteSuiviSchema } from "./schemas/delete.demande.suivi.id.schema";
import { deleteRequeteEnregistreeSchema } from "./schemas/delete.requeteEnregistree.id.schema";
import { checkActivationTokenSchema } from "./schemas/get.auth.check-activation-token.schema";
import { whoAmISchema } from "./schemas/get.auth.whoAmI.schema";
import { getCurrentCampagneSchema } from "./schemas/get.campagne.current.schema";
import { getLatestCampagneSchema} from './schemas/get.campagne.latest.schema';
import { getCampagneSchema} from './schemas/get.campagne.schema';
import { getCampagnesSchema } from "./schemas/get.campagnes.schema";
import { getCampagnesRegionSchema } from "./schemas/get.campagnes-region.schema";
import { searchCampusSchema } from "./schemas/get.campus.search.search.schema";
import { getChangelogSchema } from "./schemas/get.changelog.schema";
import { getCorrectionsSchema } from "./schemas/get.corrections.schema";
import { getDemandeFilesSchema } from "./schemas/get.demande.numero.files.schema";
import { getDemandeFileDownloadUrlSchema } from "./schemas/get.demande.numero.files.url.schema";
import { getDemandeSchema} from './schemas/get.demande.numero.schema';
import { countDemandesSchema } from "./schemas/get.demandes.count.schema";
import { getDemandesSchema } from "./schemas/get.demandes.schema";
import { getDepartementSchema } from "./schemas/get.departement.codeDepartement.schema";
import { getDepartementsSchema } from "./schemas/get.departements.schema";
import { searchDiplomeSchema } from "./schemas/get.diplome.search.search.schema";
import { searchDisciplineSchema } from "./schemas/get.discipline.search.search.schema";
import { redirectDneSchema } from "./schemas/get.dne_connect.schema";
import { getDneUrlSchema } from "./schemas/get.dne_url.schema";
import { getDomaineDeFormationCodeNsfSchema } from "./schemas/get.domaine-de-formation.codeNsf.schema";
import { getDomaineDeFormationSchema } from "./schemas/get.domaine-de-formation.schema";
import { searchDomaineProfessionnelSchema } from "./schemas/get.domaine-professionnel.search.search.schema";
import { getEditoSchema } from "./schemas/get.edito.schema";
import { searchEtablissementPerdirSchema } from "./schemas/get.etablissement.perdir.search.search.schema";
import { searchEtablissementSchema } from "./schemas/get.etablissement.search.search.schema";
import { getAnalyseDetailleeEtablissementSchema } from "./schemas/get.etablissement.uai.analyse-detaillee.schema";
import { getHeaderEtablissementSchema } from "./schemas/get.etablissement.uai.header.schema";
import { getDataForEtablissementMapListSchema } from "./schemas/get.etablissement.uai.map.list.schema";
import { getDataForEtablissementMapSchema } from "./schemas/get.etablissement.uai.map.schema";
import { getEtablissementSchema } from "./schemas/get.etablissement.uai.schema";
import { getFormationEtablissementsSchema } from "./schemas/get.etablissements.schema";
import { searchFiliereSchema } from "./schemas/get.filiere.search.search.schema";
import { getFormationCfdIndicatorsSchema } from "./schemas/get.formation.cfd.indicators.schema";
import { getFormationCfdMapSchema } from "./schemas/get.formation.cfd.map.schema";
import { getFormationCfdSchema } from "./schemas/get.formation.cfd.schema";
import { getFormationsSchema } from "./schemas/get.formations.schema";
import { getGlossaireEntrySchema } from "./schemas/get.glossaire.id.schema";
import { getGlossaireSchema } from "./schemas/get.glossaire.schema";
import { getHomeSchema } from "./schemas/get.home.schema";
import { getMaintenanceSchema } from "./schemas/get.maintenance.schema";
import { searchMetierSchema } from "./schemas/get.metier.search.search.schema";
import { searchNsfSchema } from "./schemas/get.nsf.search.search.schema";
import { searchNsfFormationSchema } from "./schemas/get.nsf-diplome.search.search.schema";
import { getDataForPanoramaDepartementSchema } from "./schemas/get.panorama.stats.departement.schema";
import { getDataForPanoramaRegionSchema } from "./schemas/get.panorama.stats.region.schema";
import { getFormationsPilotageSchema} from './schemas/get.pilotage.formations.schema';
import { getPilotageSchema } from "./schemas/get.pilotage.schema";
import { getRegionSchema } from "./schemas/get.region.codeRegion.schema";
import { getRegionsSchema } from "./schemas/get.regions.schema";
import { getRequetesEnregistreesSchema } from "./schemas/get.requetes.schema";
import { getDemandesRestitutionSchema } from "./schemas/get.restitution.demandes.schema";
import { getStatsRestitutionSchema } from "./schemas/get.restitution.stats.schema";
import { getSuiviImpactStatsRegionsSchema } from "./schemas/get.suivi-impact.stats.regions.schema";
import { getSuiviImpactStatsSchema } from "./schemas/get.suivi-impact.stats.schema";
import { searchUserSchema } from "./schemas/get.user.search.search.schema";
import { getUsersSchema } from "./schemas/get.users.schema";
import { activateUserSchema } from "./schemas/post.auth.activate.schema";
import { loginSchema } from "./schemas/post.auth.login.schema";
import { logoutSchema } from "./schemas/post.auth.logout.schema";
import { resetPasswordSchema } from "./schemas/post.auth.reset-password.schema";
import { sendResetPasswordSchema } from "./schemas/post.auth.send-reset-password.schema";
import { createCampagneSchema } from "./schemas/post.campagnes.campagneId.schema";
import { createCampagneRegionSchema } from "./schemas/post.campagnes-region.campagneRegionId.schema";
import { submitCorrectionSchema } from "./schemas/post.correction.submit.schema";
import { submitDemandeAccessLogSchema } from "./schemas/post.demande.access.submit.schema";
import { submitAvisSchema } from "./schemas/post.demande.avis.submit.schema";
import { importDemandeSchema } from "./schemas/post.demande.import.numero.schema";
import { submitChangementStatutSchema } from "./schemas/post.demande.statut.submit.schema";
import { submitDemandeSchema } from "./schemas/post.demande.submit.schema";
import { submitSuiviSchema } from "./schemas/post.demande.suivi.schema";
import { submitDemandesStatutSchema } from "./schemas/post.demandes.statut.submit.schema";
import { getMetabaseDashboardUrlSchema } from "./schemas/post.generate-metabase-dashboard-url.schema";
import { submitRequeteEnregistreeSchema } from "./schemas/post.requete.enregistrement.schema";
import { createUserSchema } from "./schemas/post.users.userId.schema";
import { editCampagneSchema } from "./schemas/put.campagnes.campagneId.schema";
import { editCampagneRegionSchema } from "./schemas/put.campagnes-region.campagneRegionId.schema";
import { uploadDemandeFilesSchema } from "./schemas/put.demande.numero.files.schema";
import { editUserSchema } from "./schemas/put.users.userId.schema";
import type { IRoutesDefinition } from "./types";

export const ROUTES = {
  "[GET]/maintenance": {
    url: "/maintenance",
    method: "GET",
    schema: getMaintenanceSchema,
  },
  "[GET]/auth/check-activation-token": {
    url: "/auth/check-activation-token",
    method: "GET",
    schema: checkActivationTokenSchema,
  },
  "[POST]/auth/activate": {
    url: "/auth/activate",
    method: "POST",
    schema: activateUserSchema,
  },
  "[POST]/auth/login": {
    url: "/auth/login",
    method: "POST",
    schema: loginSchema,
  },
  "[POST]/auth/logout": {
    url: "/auth/logout",
    method: "POST",
    schema: logoutSchema,
  },
  "[POST]/auth/send-reset-password": {
    url: "/auth/send-reset-password",
    method: "POST",
    schema: sendResetPasswordSchema,
  },
  "[POST]/auth/reset-password": {
    url: "/auth/reset-password",
    method: "POST",
    schema: resetPasswordSchema,
  },
  "[GET]/auth/whoAmI": {
    url: "/auth/whoAmI",
    method: "GET",
    schema: whoAmISchema,
  },
  "[GET]/changelog": {
    url: "/changelog",
    method: "GET",
    schema: getChangelogSchema,
  },
  "[GET]/healthcheck": {
    url: "/healthcheck",
    method: "GET",
    schema: getHomeSchema,
  },
  "[GET]/users": {
    url: "/users",
    method: "GET",
    schema: getUsersSchema,
  },
  "[POST]/users/:userId": {
    url: "/users/:userId",
    method: "POST",
    schema: createUserSchema,
  },
  "[PUT]/users/:userId": {
    url: "/users/:userId",
    method: "PUT",
    schema: editUserSchema,
  },
  "[GET]/user/search/:search": {
    url: "/user/search/:search",
    method: "GET",
    schema: searchUserSchema,
  },
  "[GET]/campagnes": {
    url: "/campagnes",
    method: "GET",
    schema: getCampagnesSchema,
  },
  "[POST]/campagnes/:campagneId": {
    url: "/campagnes/:campagneId",
    method: "POST",
    schema: createCampagneSchema,
  },
  "[PUT]/campagnes/:campagneId": {
    url: "/campagnes/:campagneId",
    method: "PUT",
    schema: editCampagneSchema,
  },
  "[GET]/campagne/:campagneId": {
    url: "/campagne/:campagneId",
    method: "GET",
    schema: getCampagneSchema,
  },
  "[GET]/campagne/current": {
    url: "/campagne/current",
    method: "GET",
    schema: getCurrentCampagneSchema,
  },
  "[GET]/campagne/latest": {
    url: "/campagne/latest",
    method: "GET",
    schema: getLatestCampagneSchema,
  },
  "[GET]/campagnes-region": {
    url: "/campagnes-region",
    method: "GET",
    schema: getCampagnesRegionSchema,
  },
  "[POST]/campagnes-region/:campagneRegionId": {
    url: "/campagnes-region/:campagneRegionId",
    method: "POST",
    schema: createCampagneRegionSchema,
  },
  "[PUT]/campagnes-region/:campagneRegionId": {
    url: "/campagnes-region/:campagneRegionId",
    method: "PUT",
    schema: editCampagneRegionSchema,
  },
  "[DELETE]/campagne-region/:id": {
    url: "/campagne-region/:id",
    method: "DELETE",
    schema: deleteCampagneRegionSchema,
  },
  "[POST]/generate-metabase-dashboard-url": {
    url: "/generate-metabase-dashboard-url",
    method: "POST",
    schema: getMetabaseDashboardUrlSchema,
  },
  "[GET]/dne_url": {
    url: "/dne_url",
    method: "GET",
    schema: getDneUrlSchema,
  },
  "[GET]/dne_connect": {
    url: "/dne_connect",
    method: "GET",
    schema: redirectDneSchema,
  },
  "[GET]/corrections": {
    url: "/corrections",
    method: "GET",
    schema: getCorrectionsSchema,
  },
  "[POST]/correction/submit": {
    url: "/correction/submit",
    method: "POST",
    schema: submitCorrectionSchema,
  },
  "[GET]/etablissement/:uai/analyse-detaillee": {
    url: "/etablissement/:uai/analyse-detaillee",
    method: "GET",
    schema: getAnalyseDetailleeEtablissementSchema,
  },
  "[GET]/etablissement/:uai/map": {
    url: "/etablissement/:uai/map",
    method: "GET",
    schema: getDataForEtablissementMapSchema,
  },
  "[GET]/etablissement/:uai/map/list": {
    url: "/etablissement/:uai/map/list",
    method: "GET",
    schema: getDataForEtablissementMapListSchema,
  },
  "[GET]/panorama/stats/departement": {
    url: "/panorama/stats/departement",
    method: "GET",
    schema: getDataForPanoramaDepartementSchema,
  },
  "[GET]/panorama/stats/region": {
    url: "/panorama/stats/region",
    method: "GET",
    schema: getDataForPanoramaRegionSchema,
  },
  "[GET]/restitution/demandes": {
    url: "/restitution/demandes",
    method: "GET",
    schema: getDemandesRestitutionSchema,
  },
  "[GET]/departement/:codeDepartement": {
    url: "/departement/:codeDepartement",
    method: "GET",
    schema: getDepartementSchema,
  },
  "[GET]/departements": {
    url: "/departements",
    method: "GET",
    schema: getDepartementsSchema,
  },
  "[GET]/etablissement/:uai": {
    url: "/etablissement/:uai",
    method: "GET",
    schema: getEtablissementSchema,
  },
  "[GET]/etablissements": {
    url: "/etablissements",
    method: "GET",
    schema: getFormationEtablissementsSchema,
  },
  "[GET]/formations": {
    url: "/formations",
    method: "GET",
    schema: getFormationsSchema,
  },
  "[GET]/etablissement/:uai/header": {
    url: "/etablissement/:uai/header",
    method: "GET",
    schema: getHeaderEtablissementSchema,
  },
  "[GET]/suivi-impact/stats": {
    url: "/suivi-impact/stats",
    method: "GET",
    schema: getSuiviImpactStatsSchema,
  },
  "[GET]/suivi-impact/stats/regions": {
    url: "/suivi-impact/stats/regions",
    method: "GET",
    schema: getSuiviImpactStatsRegionsSchema,
  },
  "[GET]/region/:codeRegion": {
    url: "/region/:codeRegion",
    method: "GET",
    schema: getRegionSchema,
  },
  "[GET]/regions": {
    url: "/regions",
    method: "GET",
    schema: getRegionsSchema,
  },
  "[GET]/pilotage": {
    url: "/pilotage",
    method: "GET",
    schema: getPilotageSchema,
  },
  "[GET]/pilotage/formations": {
    url: "/pilotage/formations",
    method: "GET",
    schema: getFormationsPilotageSchema,
  },
  "[GET]/restitution/stats": {
    url: "/restitution/stats",
    method: "GET",
    schema: getStatsRestitutionSchema,
  },
  "[GET]/campus/search/:search": {
    url: "/campus/search/:search",
    method: "GET",
    schema: searchCampusSchema,
  },
  "[GET]/diplome/search/:search": {
    url: "/diplome/search/:search",
    method: "GET",
    schema: searchDiplomeSchema,
  },
  "[GET]/discipline/search/:search": {
    url: "/discipline/search/:search",
    method: "GET",
    schema: searchDisciplineSchema,
  },
  "[GET]/domaine-professionnel/search/:search": {
    url: "/domaine-professionnel/search/:search",
    method: "GET",
    schema: searchDomaineProfessionnelSchema,
  },
  "[GET]/etablissement/search/:search": {
    url: "/etablissement/search/:search",
    method: "GET",
    schema: searchEtablissementSchema,
  },
  "[GET]/filiere/search/:search": {
    url: "/filiere/search/:search",
    method: "GET",
    schema: searchFiliereSchema,
  },
  "[GET]/metier/search/:search": {
    url: "/metier/search/:search",
    method: "GET",
    schema: searchMetierSchema,
  },
  "[GET]/nsf/search/:search": {
    url: "/nsf/search/:search",
    method: "GET",
    schema: searchNsfSchema,
  },
  "[GET]/nsf-diplome/search/:search": {
    url: "/nsf-diplome/search/:search",
    method: "GET",
    schema: searchNsfFormationSchema,
  },
  "[GET]/glossaire": {
    url: "/glossaire",
    method: "GET",
    schema: getGlossaireSchema,
  },
  "[GET]/glossaire/:id": {
    url: "/glossaire/:id",
    method: "GET",
    schema: getGlossaireEntrySchema,
  },
  "[DELETE]/requeteEnregistree/:id": {
    url: "/requeteEnregistree/:id",
    method: "DELETE",
    schema: deleteRequeteEnregistreeSchema,
  },
  "[GET]/requetes": {
    url: "/requetes",
    method: "GET",
    schema: getRequetesEnregistreesSchema,
  },
  "[POST]/requete/enregistrement": {
    url: "/requete/enregistrement",
    method: "POST",
    schema: submitRequeteEnregistreeSchema,
  },
  "[GET]/demandes/count": {
    url: "/demandes/count",
    method: "GET",
    schema: countDemandesSchema,
  },
  "[DELETE]/demande/avis/:id": {
    url: "/demande/avis/:id",
    method: "DELETE",
    schema: deleteAvisSchema,
  },
  "[DELETE]/demande/statut/:id": {
    url: "/demande/statut/:id",
    method: "DELETE",
    schema: deleteChangementStatutSchema,
  },
  "[DELETE]/demande/:numero": {
    url: "/demande/:numero",
    method: "DELETE",
    schema: deleteDemandeSchema,
  },
  "[DELETE]/demande/:numero/files": {
    url: "/demande/:numero/files",
    method: "DELETE",
    schema: deleteDemandeFilesSchema,
  },
  "[DELETE]/demande/suivi/:id": {
    url: "/demande/suivi/:id",
    method: "DELETE",
    schema: deleteSuiviSchema,
  },
  "[GET]/edito": {
    url: "/edito",
    method: "GET",
    schema: getEditoSchema,
  },
  "[GET]/demande/:numero": {
    url: "/demande/:numero",
    method: "GET",
    schema: getDemandeSchema,
  },
  "[GET]/demande/:numero/files/url": {
    url: "/demande/:numero/files/url",
    method: "GET",
    schema: getDemandeFileDownloadUrlSchema,
  },
  "[GET]/demande/:numero/files": {
    url: "/demande/:numero/files",
    method: "GET",
    schema: getDemandeFilesSchema,
  },
  "[GET]/demandes": {
    url: "/demandes",
    method: "GET",
    schema: getDemandesSchema,
  },
  "[POST]/demande/import/:numero": {
    url: "/demande/import/:numero",
    method: "POST",
    schema: importDemandeSchema,
  },
  "[POST]/demandes/statut/submit": {
    url: "/demandes/statut/submit",
    method: "POST",
    schema: submitDemandesStatutSchema,
  },
  "[GET]/etablissement/perdir/search/:search": {
    url: "/etablissement/perdir/search/:search",
    method: "GET",
    schema: searchEtablissementPerdirSchema,
  },
  "[POST]/demande/avis/submit": {
    url: "/demande/avis/submit",
    method: "POST",
    schema: submitAvisSchema,
  },
  "[POST]/demande/statut/submit": {
    url: "/demande/statut/submit",
    method: "POST",
    schema: submitChangementStatutSchema,
  },
  "[POST]/demande/submit": {
    url: "/demande/submit",
    method: "POST",
    schema: submitDemandeSchema,
  },
  "[POST]/demande/access/submit": {
    url: "/demande/access/submit",
    method: "POST",
    schema: submitDemandeAccessLogSchema,
  },
  "[POST]/demande/suivi": {
    url: "/demande/suivi",
    method: "POST",
    schema: submitSuiviSchema,
  },
  "[PUT]/demande/:numero/files": {
    url: "/demande/:numero/files",
    method: "PUT",
    schema: uploadDemandeFilesSchema,
  },
  "[GET]/formation/:cfd": {
    url: "/formation/:cfd",
    method: "GET",
    schema: getFormationCfdSchema,
  },
  "[GET]/formation/:cfd/map": {
    url: "/formation/:cfd/map",
    method: "GET",
    schema: getFormationCfdMapSchema,
  },
  "[GET]/formation/:cfd/indicators": {
    url: "/formation/:cfd/indicators",
    method: "GET",
    schema: getFormationCfdIndicatorsSchema,
  },
  "[GET]/domaine-de-formation/:codeNsf": {
    url: "/domaine-de-formation/:codeNsf",
    method: "GET",
    schema: getDomaineDeFormationCodeNsfSchema,
  },
  "[GET]/domaine-de-formation": {
    url: "/domaine-de-formation",
    method: "GET",
    schema: getDomaineDeFormationSchema,
  },
} satisfies IRoutesDefinition;
