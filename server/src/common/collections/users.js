import { integer, object, objectId, string, boolean, arrayOf, date } from "./jsonSchema/jsonSchemaTypes.js";
import { schemaValidation } from "../utils/schemaUtils.js";
import { siretSchema, passwordSchema } from "../utils/validationUtils.js";

export const name = "users";

export function indexes() {
  return [[{ email: 1 }, { unique: true }]];
}

export function schema() {
  return object(
    {
      _id: objectId(),
      email: string({ description: "Email utilisateur" }),
      password: string({ description: "Le mot de passe hashé" }),
      civility: string({ description: "civilité", enum: ["Madame", "Monsieur"] }),
      nom: string({ description: "Le nom de l'utilisateur" }),
      prenom: string({ description: "Le prénom de l'utilisateur" }),
      telephone: string({ description: "Le téléphone de l'utilisateur" }),
      siret: string({ description: "N° SIRET", pattern: "^[0-9]{14}$", maxLength: 14, minLength: 14 }),
      account_status: string({
        description: "Statut du compte",
        enum: ["FORCE_RESET_PASSWORD", "FORCE_COMPLETE_PROFILE", "CONFIRMED"],
      }),
      has_accept_cgu_version: string({ description: "Version des cgu accepté par l'utilisateur" }),
      orign_register: string({ description: "Origine de l'inscription" }),
      isAdmin: boolean({ description: "true si l'utilisateur est administrateur" }),
      roles: arrayOf(objectId(), { description: "Roles de l'utilisateur" }),
      acl: arrayOf(string(), { description: "Access control level array" }),
      created_at: date({ description: "Date de création du compte" }),
      last_connection: date({ description: "Date de dernière connexion" }),
      invalided_token: boolean({ description: "true si besoin de reset le token" }),
      v: integer(),
    },
    { required: ["email"], additionalProperties: true }
  );
}

// Default value
export function defaultUser() {
  return {
    account_status: "FORCE_RESET_PASSWORD",
    created_at: new Date(),
  };
}

// Extra validation
export function validationUser(props) {
  return schemaValidation(props, schema(), [
    {
      name: "password",
      base: passwordSchema(),
    },
    {
      name: "siret",
      base: siretSchema(),
    },
  ]);
}
