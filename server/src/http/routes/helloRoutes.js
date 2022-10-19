import express from "express";
import { logger } from "../../common/logger.js";
import { tryCatch } from "../middlewares/tryCatchMiddleware.js";
import { arrayOf, validate } from "../utils/validators.js";
import Joi from "joi";
import { createUser } from "../../common/components/usersComponent.js";

/**
 * Sample route module for displaying hello message
 */
export default () => {
  const router = express.Router();

  router.get(
    "/api/hello",
    tryCatch(async (req, res) => {
      const { messages } = await validate(
        { ...req.query, ...req.params },
        {
          messages: arrayOf(Joi.string().required()).default([]),
        }
      );

      await createUser({ email: "h@ck.me", password: "SuperGRAND8LONGPASSWORD!", siret: "98765432400019" });

      logger.info("Hello :", { messages });

      return res.json({
        hello: messages,
      });
    })
  );

  return router;
};
