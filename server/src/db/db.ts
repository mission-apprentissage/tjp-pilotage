import { Kysely, PostgresDialect } from "kysely";
import { Pool, types } from "pg";

import { config } from "../../config/config";
import { logger } from "../logger";
import { DB as DBSchema } from "./schema";

types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT4, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT2, (val) => parseInt(val));
types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));

const pool = new Pool({
  connectionString: config.PILOTAGE_POSTGRES_URI,
  ssl: config.PILOTAGE_POSTGRES_CA
    ? { rejectUnauthorized: false, ca: config.PILOTAGE_POSTGRES_CA }
    : undefined,
});

pool.on("error", (error) => {
  try {
    console.error("lost connection with DB!");
    logger.error("pg pool lost connexion with database", { error });
    // eslint-disable-next-line no-empty
  } catch (e) {}
});

// gestion du typage des vues matérialisée inspirée de https://github.com/RobinBlomberg/kysely-codegen/issues/72
export interface DB extends Omit<DBSchema, "formationNonMaterializedView"> {
  formationView: {
    [K in keyof DBSchema["formationNonMaterializedView"]]: NonNullable<
      DBSchema["formationNonMaterializedView"][K]
    >;
  };
}
export interface DB extends Omit<DBSchema, "formationNonMaterializedView"> {
  formationScolaireView: {
    [K in keyof DBSchema["formationNonMaterializedView"]]: NonNullable<
      DBSchema["formationNonMaterializedView"][K]
    >;
  };
}
export interface DB extends Omit<DBSchema, "formationNonMaterializedView"> {
  formationApprentissageView: {
    [K in keyof DBSchema["formationNonMaterializedView"]]: NonNullable<
      DBSchema["formationNonMaterializedView"][K]
    >;
  };
}
export interface DB extends Omit<DBSchema, "latestDemandeNonMaterializedView"> {
  latestDemandeView: {
    [K in keyof DBSchema["latestDemandeNonMaterializedView"]]: NonNullable<
      DBSchema["latestDemandeNonMaterializedView"][K]
    >;
  };
}
export interface DB
  extends Omit<DBSchema, "latestIntentionNonMaterializedView"> {
  latestIntentionView: {
    [K in keyof DBSchema["latestIntentionNonMaterializedView"]]: NonNullable<
      DBSchema["latestIntentionNonMaterializedView"][K]
    >;
  };
}
export interface DB
  extends Omit<DBSchema, "latestDemandeIntentionNonMaterializedView"> {
  latestDemandeIntentionView: {
    [K in keyof DBSchema["latestDemandeIntentionNonMaterializedView"]]: NonNullable<
      DBSchema["latestDemandeIntentionNonMaterializedView"][K]
    >;
  };
}
export interface DB
  extends Omit<DBSchema, "demandeIntentionNonMaterializedView"> {
  demandeIntentionView: {
    [K in keyof DBSchema["demandeIntentionNonMaterializedView"]]: NonNullable<
      DBSchema["demandeIntentionNonMaterializedView"][K]
    >;
  };
}

export const kdb = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
  log: (event) => {
    if (event.level === config.sql.logLevel) {
      console.log(`\n====================================\n`);
      console.log(
        replaceQueryPlaceholders(
          event.query.sql,
          event.query.parameters as string[]
        )
      );
      console.log({
        parameters: event.query.parameters
          .map((p, index) => `$${index + 1} = ${p}`)
          .join(", "),
      });
      console.log({ duration: event.queryDurationMillis });
    }
  },
});

function replaceQueryPlaceholders(query: string, values: string[]): string {
  let modifiedQuery = query;

  // Replace each placeholder with the corresponding value from the array
  values.forEach((value, index) => {
    // The placeholder in the query will be like $1, $2, etc.
    const placeholder = `$${index + 1}`;
    modifiedQuery = modifiedQuery.replace(placeholder, `'${value}'`);
  });

  return modifiedQuery;
}
