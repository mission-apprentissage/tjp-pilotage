import { deleteDemandeSchema } from "./schemas/delete.demande.numero.schema";
import { deleteSuiviSchema } from "./schemas/delete.demande.suivi.id.schema";
import { deleteAvisSchema } from "./schemas/delete.intention.avis.id.schema";
import { deleteIntentionFilesSchema } from "./schemas/delete.intention.numero.files.schema";
import { deleteIntentionSchema } from "./schemas/delete.intention.numero.schema";
import { deleteChangementStatutSchema } from "./schemas/delete.intention.statut.id.schema";
import { deleteRequeteEnregistreeSchema } from "./schemas/delete.requeteEnregistree.id.schema";
import { checkActivationTokenSchema } from "./schemas/get.auth.check-activation-token.schema";
import { whoAmISchema } from "./schemas/get.auth.whoAmI.schema";
import { getCurrentCampagneSchema as getCurrentCampagneExpeSchema } from "./schemas/get.campagne.expe.default.schema";
import { getCampagnesSchema } from "./schemas/get.campagnes.schema";
import { searchCampusSchema } from "./schemas/get.campus.search.search.schema";
import { getChangelogSchema } from "./schemas/get.changelog.schema";
import { getCorrectionsSchema } from "./schemas/get.corrections.schema";
import { getCurrentCampagneSchema } from "./schemas/get.demande.campagne.default.schema";
import { getDemandeSchema } from "./schemas/get.demande.numero.schema";
import { countDemandesSchema } from "./schemas/get.demandes.count.schema";
import { getDemandesSchema } from "./schemas/get.demandes.schema";
import { getDepartementSchema } from "./schemas/get.departement.codeDepartement.schema";
import { getDepartementsSchema } from "./schemas/get.departements.schema";
import { searchDiplomeSchema } from "./schemas/get.diplome.search.search.schema";
import { searchDisciplineSchema } from "./schemas/get.discipline.search.search.schema";
import { redirectDneSchema } from "./schemas/get.dne_connect.schema";
import { getDneUrlSchema } from "./schemas/get.dne_url.schema";
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
import { getFormationSchema } from "./schemas/get.formations.schema";
import { getGlossaireEntrySchema } from "./schemas/get.glossaire.id.schema";
import { getGlossaireSchema } from "./schemas/get.glossaire.schema";
import { getHomeSchema } from "./schemas/get.home.schema";
import { getIntentionFilesSchema } from "./schemas/get.intention.numero.files.schema";
import { getIntentionFileDownloadUrlSchema } from "./schemas/get.intention.numero.files.url.schema";
import { getIntentionSchema } from "./schemas/get.intention.numero.schema";
import { countIntentionsSchema } from "./schemas/get.intentions.count.schema";
import { getIntentionsSchema } from "./schemas/get.intentions.schema";
import { getMaintenanceSchema } from "./schemas/get.maintenance.schema";
import { searchMetierSchema } from "./schemas/get.metier.search.search.schema";
import { searchNsfSchema } from "./schemas/get.nsf.search.search.schema";
import { searchNsfFormationSchema } from "./schemas/get.nsf-diplome.search.search.schema";
import { getDataForPanoramaDepartementSchema } from "./schemas/get.panorama.stats.departement.schema";
import { getDataForPanoramaRegionSchema } from "./schemas/get.panorama.stats.region.schema";
import { getFormationsPilotageIntentionsSchema } from "./schemas/get.pilotage-intentions.formations.schema";
import { getRepartitionPilotageIntentionsSchema } from "./schemas/get.pilotage-intentions.repartition.schema";
import { getStatsPilotageIntentionsSchema } from "./schemas/get.pilotage-intentions.stats.schema";
import { getPilotageReformeStatsRegionsSchema } from "./schemas/get.pilotage-reforme.stats.regions.schema";
import { getPilotageReformeStatsSchema } from "./schemas/get.pilotage-reforme.stats.schema";
import { getRegionSchema } from "./schemas/get.region.codeRegion.schema";
import { getRegionsSchema } from "./schemas/get.regions.schema";
import { getRequetesEnregistreesSchema } from "./schemas/get.requetes.schema";
import { getDemandesRestitutionIntentionsSchema } from "./schemas/get.restitution-intentions.demandes.schema";
import { getStatsRestitutionIntentionsSchema } from "./schemas/get.restitution-intentions.stats.schema";
import { searchUserSchema } from "./schemas/get.user.search.search.schema";
import { getUsersSchema } from "./schemas/get.users.schema";
import { activateUserSchema } from "./schemas/post.auth.activate.schema";
import { loginSchema } from "./schemas/post.auth.login.schema";
import { logoutSchema } from "./schemas/post.auth.logout.schema";
import { resetPasswordSchema } from "./schemas/post.auth.reset-password.schema";
import { sendResetPasswordSchema } from "./schemas/post.auth.send-reset-password.schema";
import { createCampagneSchema } from "./schemas/post.campagnes.campagneId.schema";
import { submitCorrectionSchema } from "./schemas/post.correction.submit.schema";
import { submitIntentionAccessLogSchema } from "./schemas/post.demande.access.submit.schema";
import { importDemandeSchema } from "./schemas/post.demande.import.numero.schema";
import { submitDemandeSchema } from "./schemas/post.demande.submit.schema";
import { submitSuiviSchema } from "./schemas/post.demande.suivi.schema";
import { getMetabaseDashboardUrlSchema } from "./schemas/post.generate-metabase-dashboard-url.schema";
import { submitAvisSchema } from "./schemas/post.intention.avis.submit.schema";
import { importIntentionSchema } from "./schemas/post.intention.import.numero.schema";
import { submitChangementStatutSchema } from "./schemas/post.intention.statut.submit.schema";
import { submitIntentionSchema } from "./schemas/post.intention.submit.schema";
import { submitRequeteEnregistreeSchema } from "./schemas/post.requete.enregistrement.schema";
import { createUserSchema } from "./schemas/post.users.userId.schema";
import { editCampagneSchema } from "./schemas/put.campagnes.campagneId.schema";
import { uploadIntentionFilesSchema } from "./schemas/put.intention.numero.files.schema";
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
  "[POST]/generate-metabase-dashboard-url": {
    url: "/generate-metabase-dashboard-url",
    method: "PUT",
    schema: getMetabaseDashboardUrlSchema,
  },
  "[GET]/dne_url": {
    url: "/dne_url",
    method: "GET",
    schema: getDneUrlSchema,
  },
  "[GET]/dne_connect": {
    url: "dne_connect",
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
  "[GET]/panorama/stats/etablissement/:uai": {
    url: "/panorama/stats/etablissement/:uai",
    method: "GET",
    schema: getEtablissementStatsSchema,
  },
  "[GET]/panorama/stats/region": {
    url: "/panorama/stats/region",
    method: "GET",
    schema: getDataForPanoramaRegionSchema,
  },
  "[GET]/restitution-intentions/demandes": {
    url: "/restitution-intentions/demandes",
    method: "GET",
    schema: getDemandesRestitutionIntentionsSchema,
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
    schema: getFormationSchema,
  },
  "[GET]/pilotage-intentions/formations": {
    url: "/pilotage-intentions/formations",
    method: "GET",
    schema: getFormationsPilotageIntentionsSchema,
  },
  "[GET]/etablissement/:uai/header": {
    url: "/etablissement/:uai/header",
    method: "GET",
    schema: getHeaderEtablissementSchema,
  },
  "[GET]/pilotage-reforme/stats": {
    url: "/pilotage-reforme/stats",
    method: "GET",
    schema: getPilotageReformeStatsSchema,
  },
  "[GET]/pilotage-reforme/stats/regions": {
    url: "/pilotage-reforme/stats/regions",
    method: "GET",
    schema: getPilotageReformeStatsRegionsSchema,
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
  "[GET]/pilotage-intentions/repartition": {
    url: "/pilotage-intentions/repartition",
    method: "GET",
    schema: getRepartitionPilotageIntentionsSchema,
  },
  "[GET]/pilotage-intentions/stats": {
    url: "/pilotage-intentions/stats",
    method: "GET",
    schema: getStatsPilotageIntentionsSchema,
  },
  "[GET]/restitution-intentions/stats": {
    url: "/restitution-intentions/stats",
    method: "GET",
    schema: getStatsRestitutionIntentionsSchema,
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
  "[GET]/demandes/count": {
    url: "/demandes/count",
    method: "GET",
    schema: countDemandesSchema,
  },
  "[DELETE]/demande/:numero": {
    url: "/demande/:numero",
    method: "DELETE",
    schema: deleteDemandeSchema,
  },
  "[DELETE]/demande/suivi/:id": {
    url: "/demande/suivi/:id",
    method: "DELETE",
    schema: deleteSuiviSchema,
  },
  "[GET]/demande/campagne/default": {
    url: "/demande/campagne/default",
    method: "GET",
    schema: getCurrentCampagneSchema,
  },
  "[GET]/demande/:numero": {
    url: "/demande/:numero",
    method: "GET",
    schema: getDemandeSchema,
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
  "[POST]/demande/submit": {
    url: "/demande/submit",
    method: "POST",
    schema: submitDemandeSchema,
  },
  "[POST]/demande/access/submit": {
    url: "/demande/access/submit",
    method: "POST",
    schema: submitIntentionAccessLogSchema,
  },
  "[POST]/demande/suivi": {
    url: "/demande/suivi",
    method: "POST",
    schema: submitSuiviSchema,
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
  "[GET]/intentions/count": {
    url: "/intentions/count",
    method: "GET",
    schema: countIntentionsSchema,
  },
  "[DELETE]/intention/avis/:id": {
    url: "/intention/avis/:id",
    method: "DELETE",
    schema: deleteAvisSchema,
  },
  "[DELETE]/intention/statut/:id": {
    url: "/intention/statut/:id",
    method: "DELETE",
    schema: deleteChangementStatutSchema,
  },
  "[DELETE]/intention/:numero": {
    url: "/intention/:numero",
    method: "DELETE",
    schema: deleteIntentionSchema,
  },
  "[DELETE]/intention/:numero/files": {
    url: "/intention/:numero/files",
    method: "DELETE",
    schema: deleteIntentionFilesSchema,
  },
  "[DELETE]/intention/suivi/:id": {
    url: "/intention/suivi/:id",
    method: "DELETE",
    schema: deleteSuiviSchema,
  },
  "[GET]/campagne/expe/default": {
    url: "/campagne/expe/default",
    method: "GET",
    schema: getCurrentCampagneExpeSchema,
  },
  "[GET]/edito": {
    url: "/edito",
    method: "GET",
    schema: getEditoSchema,
  },
  "[GET]/intention/:numero": {
    url: "/intention/:numero",
    method: "GET",
    schema: getIntentionSchema,
  },
  "[GET]/intention/:numero/files/url": {
    url: "/intention/:numero/files/url",
    method: "GET",
    schema: getIntentionFileDownloadUrlSchema,
  },
  "[GET]/intention/:numero/files": {
    url: "/intention/:numero/files",
    method: "GET",
    schema: getIntentionFilesSchema,
  },
  "[GET]/intentions": {
    url: "/intentions",
    method: "GET",
    schema: getIntentionsSchema,
  },
  "[POST]/intention/import/:numero": {
    url: "/intention/import/:numero",
    method: "POST",
    schema: importIntentionSchema,
  },
  "[GET]/etablissement/perdir/search/:search": {
    url: "/etablissement/perdir/search/:search",
    method: "GET",
    schema: searchEtablissementPerdirSchema,
  },
  "[POST]/intention/avis/submit": {
    url: "/intention/avis/submit",
    method: "POST",
    schema: submitAvisSchema,
  },
  "[POST]/intention/statut/submit": {
    url: "/intention/statut/submit",
    method: "POST",
    schema: submitChangementStatutSchema,
  },
  "[POST]/intention/submit": {
    url: "/intention/submit",
    method: "POST",
    schema: submitIntentionSchema,
  },
  "[POST]/intention/access/submit": {
    url: "/intention/access/submit",
    method: "POST",
    schema: submitIntentionAccessLogSchema,
  },
  "[POST]/intention/suivi": {
    url: "/intention/suivi",
    method: "POST",
    schema: submitSuiviSchema,
  },
  "[PUT]/intention/:numero/files": {
    url: "/intention/:numero/files",
    method: "PUT",
    schema: uploadIntentionFilesSchema,
  },
} satisfies IRoutesDefinition;
