import { integer, object, objectId, string, boolean, arrayOf, date } from "./jsonSchema/jsonSchemaTypes.js";
import { schemaValidation } from "../utils/schemaUtils.js";
import { passwordSchema } from "../utils/validationUtils.js";

export const name = "entities";

export function indexes() {
  return [[{ email: 1 }, { unique: true }]];
}

export function schema() {
  return object(
    {
      _id: objectId(),
      email: string({ description: "Email utilisateur" }),
      password: string({ description: "Le mot de passe hashé" }),
      keyEnum: string({
        description: "Énumération",
        enum: ["VALUE1", "VALUE2", "VALUE3"],
      }),
      aBool: boolean({ description: "true si  ..." }),
      anArray: arrayOf(objectId(), { description: "Array of objectId" }),
      created_at: date({ description: "Date de création" }),
      uai: string({ pattern: "^[0-9]{7}[a-zA-Z]$", maxLength: 8, minLength: 8 }),
      draft: boolean(),
      v: integer(),
    },
    { required: ["email", "keyEnum"], additionalProperties: true }
  );
}

// Default value
export function defaultValuesEntity() {
  return {
    keyEnum: "FORCE_RESET_PASSWORD",
    created_at: new Date(),
  };
}

// Extra validation
export function validateEntity(props) {
  const schema = schema();
  if (props.draft === false) {
    schema.required = [...schema.required, "password"];
  }

  schemaValidation(props, schema, [
    // JOI extensions modified (https://github.com/hapijs/joi/blob/master/API.md#extensions)
    {
      name: "password",
      base: passwordSchema(),
    },
  ]);
}

// const entity = { ...defaultEntity(), email: "h@ck.me", draft: false };
// validationEntity(entity, schema());
// const { insertedId } = await dbCollection(COLLECTIONS_NAMES.Entity).insertOne(entity);
