import { integer, object, objectId, string, arrayOf } from "./jsonSchema/jsonSchemaTypes.js";

export const name = "roles";

export function indexes() {
  return [[{ name: 1 }, { unique: true }]];
}

export function schema() {
  return object(
    {
      _id: objectId(),
      name: string({ description: "Nom du rôle" }),
      type: string({
        description: "type de rôle",
        enum: ["user", "permission"],
      }),
      acl: arrayOf(string(), { description: "Access control level array" }),
      title: string({ description: "titre metier du rôle" }),
      description: string({ description: "description du rôle" }),
      v: integer(),
    },
    { required: ["type", "name"], additionalProperties: false }
  );
}

// Default value
export function defaultValuesRole() {
  return {
    acl: [],
  };
}
