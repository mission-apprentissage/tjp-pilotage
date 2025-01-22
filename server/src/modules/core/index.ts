import type { Server } from "@/server/server";

import { activateUserRoute } from "./usecases/activateUser/activateUser.route";
import { checkActivationTokenRoute } from "./usecases/checkActivationToken/checkActivationToken.route";
import { createCampagneRoute } from "./usecases/createCampagne/createCampagne.route";
import { createCampagneRegionRoute } from "./usecases/createCampagneRegion/createCampagneRegion.route";
import { createUserRoute } from "./usecases/createUser/createUser.route";
import { editCampagneRoute } from "./usecases/editCampagne/editCampagne.route";
import { editCampagneRegionRoute } from "./usecases/editCampagneRegion/editCampagneRegion.route";
import { editUserRoute } from "./usecases/editUser/editUser.route";
import {
  generateMetabaseDashboardUrlRoute
} from "./usecases/generateMetabaseDashboardUrl/generateMetabaseDashboardUrl.route";
import { getCampagnesRoute } from "./usecases/getCampagnes/getCampagnes.route";
import { getCampagnesRegionRoute } from "./usecases/getCampagnesRegion/getCampagnesRegion.route";
import { getCurrentCampagneRoute } from "./usecases/getCurrentCampagne/getCurrentCampagne.route";
import { getDneAuthorizationUrlRoute } from "./usecases/getDneUrl/getDneUrl.route";
import { getUsersRoute } from "./usecases/getUsers/getUsers.route";
import { homeRoute } from "./usecases/home/home.route";
import { isMaintenanceRoute } from "./usecases/isMaintenance/isMaintenance.route";
import { loginRoute } from "./usecases/login/login.route";
import { logoutRoute } from "./usecases/logout/logout.route";
import { redirectDneRoute } from "./usecases/redirectDne/redirectDne.route";
import { resetPasswordRoute } from "./usecases/resetPassword/resetPassword.route";
import { searchUserRoute } from "./usecases/searchUser/searchUser.route";
import { sendResetPasswordRoute } from "./usecases/sendResetPassword/sendResetPassword.route";
import { whoAmIRoute } from "./usecases/whoAmI/whoAmI.route";
export { extractUserInRequest } from "./utils/extractUserInRequest/extractUserInRequest";

export const registerCoreModule = (server: Server) => {
  return {
    ...homeRoute(server),
    ...activateUserRoute(server),
    ...checkActivationTokenRoute(server),
    ...loginRoute(server),
    ...logoutRoute(server),
    ...resetPasswordRoute(server),
    ...sendResetPasswordRoute(server),
    ...whoAmIRoute(server),
    ...getUsersRoute(server),
    ...editUserRoute(server),
    ...createUserRoute(server),
    ...getDneAuthorizationUrlRoute(server),
    ...redirectDneRoute(server),
    ...getCurrentCampagneRoute(server),
    ...getCampagnesRoute(server),
    ...editCampagneRoute(server),
    ...createCampagneRoute(server),
    ...getCampagnesRegionRoute(server),
    ...editCampagneRegionRoute(server),
    ...createCampagneRegionRoute(server),
    ...generateMetabaseDashboardUrlRoute(server),
    ...searchUserRoute(server),
    ...isMaintenanceRoute(server),
  };
};

export { shootTemplate } from "./services/mailer/mailer";
