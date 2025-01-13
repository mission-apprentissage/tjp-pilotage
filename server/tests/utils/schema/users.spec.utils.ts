import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import type { Insertable } from "kysely";
import type { Role } from "shared";

import config from "@/config";
import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { cleanNull } from "@/utils/noNull";

type InsertableUser = Insertable<DB["user"]> & { role?: Role };

export function createUserBuilder(options: Partial<InsertableUser> = {}) {
  const defaultUser: InsertableUser = {
    email: options.email ?? faker.internet.email(),
    firstname: options.firstname ?? faker.person.firstName(),
    lastname: options.lastname ?? faker.person.lastName(),
    role: options.role ?? "admin",
    enabled: options.enabled ?? true,
    ...options,
  };

  return {
    withEmail: (email: string) => createUserBuilder({ ...defaultUser, email }),
    withRole: (role: Role) => createUserBuilder({ ...defaultUser, role }),
    withUais: (uais: string[]) => createUserBuilder({ ...defaultUser, uais }),
    create: async () => {
      const user = await getKbdClient().insertInto("user").values(defaultUser).returningAll().executeTakeFirst();

      if (!user) {
        throw new Error(`Failed to create user in DB: ${user}`);
      }

      return user as RequestUser;
    },
    build: () => cleanNull(defaultUser),
  };
}

export async function clearUsers() {
  await getKbdClient().deleteFrom("changementStatut").execute();
  await getKbdClient().deleteFrom("user").execute();
}

export function createAuthenticatedRequestConfig(user: RequestUser) {
  return {
    headers: {
      cookie: `Authorization=${generateAuthToken(user)}`,
    },
  };
}

export function generateAuthCookie(user: RequestUser) {
  return {
    Authorization: generateAuthToken(user as RequestUser),
  };
}

function generateAuthToken(user: RequestUser) {
  return jwt.sign({ email: user.email }, config.auth.authJwtSecret, {
    issuer: "issuer",
    expiresIn: "1h",
  });
}
