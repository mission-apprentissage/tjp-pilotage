import { defaultUser, validationUser } from "../collections/users.js";
import { dbCollection } from "../mongodb.js";

/**
 * Méthode de création d'un utilisateur
 * @param {*} userProps
 * @returns
 */
export const createUser = async (userProps) => {
  const { insertedId } = await dbCollection("users").insertOne(
    validationUser({
      ...defaultUser(),
      ...userProps,
    })
  );
  console.log(insertedId);
};
