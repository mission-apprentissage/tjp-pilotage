import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { kdb } from "../../../../db/db";
import { shootTemplate } from "../../../core/services/mailer/mailer";

export const [createUser] = inject(
  {
    insertUserQuery: ({ email }: { email: string }) =>
      kdb.insertInto("user").values({ email }).execute(),
  },
  (deps) =>
    async ({ email }: { email: string }) => {
      await deps.insertUserQuery({ email });
      const activationToken = jwt.sign({ email }, config.auth.jwtSecret, {
        issuer: "orion",
        expiresIn: "1h",
      });

      shootTemplate({
        to: email,
        subject: "Activez votre compte personnel Orion",
        template: "activate_account",
        data: {
          activationToken,
          recipient: { email, firstname: "Jean", lastname: "Dupont" },
        },
      });
    }
);
