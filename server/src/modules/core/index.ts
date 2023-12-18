import { Server } from "../../server";
import { activateUserRoute } from "./usecases/activateUser/activateUser.route";
import { checkActivationTokenRoute } from "./usecases/checkActivationToken/checkActivationToken.route";
import { createUserRoute } from "./usecases/createUser/createUser.route";
import { editUserRoute } from "./usecases/editUser/editUser.route";
import { getUsersRoute } from "./usecases/getUsers/getUsers.route";
import { homeRoute } from "./usecases/home/home.route";
import { loginRoute } from "./usecases/login/login.route";
import { logoutRoute } from "./usecases/logout/logout.route";
import { resetPasswordRoute } from "./usecases/resetPassword/resetPassword.route";
import { sendResetPasswordRoute } from "./usecases/sendResetPassword/sendResetPassword.route";
import { whoAmIRoute } from "./usecases/whoAmI/whoAmI.route";
export { extractUserInRequest } from "./utils/extractUserInRequest/extractUserInRequest";

export const registerCoreModule = ({ server }: { server: Server }) => {
  return {
    ...homeRoute({ server }),
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
  };
};

export { hasPermissionHandler } from "./utils/hasPermission";
export { shootTemplate } from "./services/mailer/mailer";
