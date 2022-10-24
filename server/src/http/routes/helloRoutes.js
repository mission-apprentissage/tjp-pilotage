import express from "express";
import { logger } from "../../common/logger.js";
import { tryCatch } from "../middlewares/tryCatchMiddleware.js";
import { arrayOf, validate } from "../../common/utils/validationUtils.js";
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

      await createUser({ email: "h+re@ck.me", password: "SuperGRANDPiPO8LONGPASSWORD!" });

      logger.info("Hello :", { messages });

      return res.json({
        hello: messages,
      });
    })
  );

  return router;
};
