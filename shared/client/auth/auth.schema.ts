import { Type } from "@sinclair/typebox";

import { passwordRegex } from "../../utils/passwordRegex";

export const authSchemas = {
  login: {
    body: Type.Object({
      email: Type.String({ format: "email" }),
      password: Type.String(),
    }),
    response: {
      200: Type.Object({
        token: Type.String(),
      }),
    },
  },
  logout: {
    response: {
      200: Type.Void(),
    },
  },
  whoAmI: {
    response: {
      200: Type.Object({
        user: Type.Object({
          id: Type.String(),
          email: Type.String(),
          role: Type.Optional(
            Type.Union([Type.Literal("admin"), Type.Literal("pilote")])
          ),
        }),
      }),
      401: Type.Void(),
    },
  },
  activateUser: {
    body: Type.Object({
      password: Type.String({
        pattern: passwordRegex,
      }),
      repeatPassword: Type.String(),
      activationToken: Type.String(),
    }),
  },
  checkActivationToken: {
    querystring: Type.Object({
      activationToken: Type.String(),
    }),
    response: {
      200: Type.Object({
        valid: Type.Literal(true),
      }),
    },
  },
  resetPassword: {
    body: Type.Object({
      password: Type.String({
        pattern: passwordRegex,
      }),
      repeatPassword: Type.String(),
      resetPasswordToken: Type.String(),
    }),
  },
  sendResetPassword: {
    body: Type.Object({
      email: Type.String({ format: "email" }),
    }),
  },
} as const;
