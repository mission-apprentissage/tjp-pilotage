import { usersDb } from "../collections/collections.js";
import { defaultValuesUser, validateUser } from "../collections/users.js";
import { hash as hashUtil, compare, isTooWeak } from "../utils/passwordUtils.js";
import { escapeRegExp } from "../utils/regexUtils.js";
import { passwordSchema } from "../utils/validationUtils.js";

/**
 * Méthode de création d'un utilisateur
 * @param {*} userProps
 * @returns
 */
export const createUser = async ({ email, password }, options = {}) => {
  const passwordHash = options.hash || hashUtil(password);
  const permissions = options.permissions || {};

  const { civility, nom, prenom, telephone, siret, account_status, custom_acl, orign_register, type } = options;
  const { insertedId } = await usersDb().insertOne(
    validateUser({
      ...defaultValuesUser(),
      email: email.toLowerCase(),
      password: passwordHash,
      is_admin: !!permissions.is_admin,
      ...(civility ? { civility } : {}),
      ...(nom ? { nom } : {}),
      ...(prenom ? { prenom } : {}),
      ...(telephone ? { telephone } : {}),
      ...(siret ? { siret } : {}),
      ...(account_status ? { account_status } : {}),
      ...(custom_acl ? { custom_acl } : {}),
      ...(type ? { type } : {}),
      ...(orign_register ? { orign_register } : {}),
    })
  );

  return insertedId;
};

/**
 * Méthode de rehash du password de l'utilisateur
 * @param {*} user
 * @param {*} password
 * @returns
 */
const rehashPassword = async (_id, password) => {
  const updated = await usersDb().findOneAndUpdate(
    { _id },
    {
      $set: {
        password: hashUtil(password),
      },
    },
    { returnDocument: "after" }
  );

  return updated;
};

/**
 * Méthode d'authentification de l'utilisateur
 * compare les hash des mots de passe
 * @param {*} email
 * @param {*} password
 * @returns
 */
export const authenticate = async (email, password) => {
  const user = await usersDb().findOne({ email });
  if (!user) {
    return null;
  }

  const current = user.password;
  if (compare(password, current)) {
    if (isTooWeak(current)) {
      await rehashPassword(user, password);
    }
    return user;
  }
  return null;
};

/**
 * Méthode de récupération d'un user depuis son email
 * @param {*} email
 * @returns
 */
export const getUser = async (email) => {
  const user = await usersDb().findOne({ email });
  if (!user) {
    throw new Error(`Unable to find user`);
  }

  return user;
};

/**
 * Méthode de récupération d'un user depuis son id
 * @param {*} _id
 * @returns
 */
export const getUserById = async (_id, select = {}) => {
  const user = await usersDb().findOne({ _id }, select);

  if (!user) {
    throw new Error(`Unable to find user`);
  }

  return user;
};

/**
 * Méthode de récupération de la liste des utilisateurs en base
 * @param {*} query
 * @returns
 */
export const getAllUsers = async (query = {}) => await usersDb().find(query, { password: 0, __v: 0 }).toArray();

/**
 * Méthode de suppresion d'un user depuis son id
 * @param {*} _id
 * @returns
 */
export const removeUser = async (_id) => {
  const user = await usersDb().findOne({ _id });

  if (!user) {
    throw new Error(`Unable to find user`);
  }

  return await usersDb().deleteOne({ _id });
};

/**
 * Méthode de mise à jour d'un user depuis son id
 * @param {*} _id
 * @returns
 */
export const updateUser = async (_id, data) => {
  const user = await usersDb().findOne({ _id });

  if (!user) {
    throw new Error(`Unable to find user`);
  }

  const updated = await usersDb().findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        ...data,
      },
    },
    { returnDocument: "after" }
  );

  return updated;
};

/**
 * Méthode de mise à jour du mot de passe d'un user
 * @param {*} _id
 * @returns
 */
export const changePassword = async (email, newPassword) => {
  const user = await usersDb().findOne({ email });
  if (!user) {
    throw new Error(`Unable to find user`);
  }

  if (passwordSchema(user.is_admin).required().validate(newPassword).error) {
    throw new Error("Password must be valid");
  }

  const updated = await usersDb().findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        account_status: user.account_status === "FORCE_RESET_PASSWORD" ? "CONFIRMED" : user.account_status,
        password: hashUtil(newPassword),
        password_updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  return updated;
};

/**
 * Méthode de recherche d'utilisateurs selon plusieurs critères
 * @param {*} searchCriteria
 * @returns
 */
export const searchUsers = async (searchCriteria) => {
  const { searchTerm } = searchCriteria;

  const matchStage = {};
  if (searchTerm) {
    matchStage.$or = [
      { email: new RegExp(escapeRegExp(searchTerm), "i") },
      { nom: new RegExp(escapeRegExp(searchTerm), "i") },
    ];
  }

  const sortStage = { nom: 1 };

  const found = await usersDb().aggregate([{ $match: matchStage }, { $sort: sortStage }]);

  return found.toArray();
};
