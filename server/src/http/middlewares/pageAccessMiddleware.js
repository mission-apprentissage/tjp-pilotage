import { isEqual, pick } from "lodash-es";

export const pageAccessMiddleware = (acl = []) => {
  return ({ user }, res, next) => {
    const permissions = { isAdmin: true };
    const current = pick(user?.permissions, Object.keys(permissions));
    if (!(isEqual(current, permissions) || acl.every((page) => user?.custom_acl?.includes(page)))) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    next();
  };
};
