import express from "express";
import { loggedInUser, structureUser } from "../../common/components/usersComponent.js";
import { tryCatch } from "../middlewares/tryCatchMiddleware.js";

export default () => {
  const router = express.Router();

  router.get(
    "/current",
    tryCatch(async (req, res) => {
      if (req.user) {
        await loggedInUser(req.user.email);
        return res.status(200).json({
          ...req.user,
          loggedIn: true,
        });
      }
      const payload = await structureUser({ email: "anonymous", roles: [], acl: [] });
      return res.json(payload);
    })
  );

  return router;
};
