import { createActionToken, createResetPasswordToken, createActivationToken } from "../utils/jwtUtils.js";
import path from "path";
import { fileURLToPath } from "url";

function getTemplateFile(name) {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  return path.join(__dirname, `${name}.mjml.ejs`);
}

export function activation_user(user, token, options = {}) {
  const prefix = options.resend ? "[Rappel] " : "";
  return {
    subject: `${prefix}Activation de votre compte`,
    templateFile: getTemplateFile("activation_user"),
    data: {
      user,
      token,
      actionToken: createActivationToken(user.username),
    },
  };
}

export function notification(cfa, token, options = {}) {
  const prefix = options.resend ? "[Rappel] " : "";
  return {
    subject: `${prefix}Notification`,
    templateFile: getTemplateFile("notification"),
    data: {
      cfa,
      token,
      actionToken: createActionToken(cfa.username),
    },
  };
}

export function reset_password(user, token) {
  return {
    subject: "Réinitialisation du mot de passe",
    templateFile: getTemplateFile("reset_password"),
    data: {
      user,
      token,
      resetPasswordToken: createResetPasswordToken(user.username),
    },
  };
}
