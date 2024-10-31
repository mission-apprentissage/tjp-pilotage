import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
const { Pool, types } = pg;

import config from "@/config";
import logger from "@/services/logger";
import { sleep } from "@/utils/asyncUtils";

import type { DB as DBSchema } from "./schema";

// gestion du typage des vues matérialisée inspirée de https://github.com/RobinBlomberg/kysely-codegen/issues/72
export interface FormationMaterializedView extends Omit<DBSchema, "formationNonMaterializedView"> {
  formationView: {
    [K in keyof DBSchema["formationNonMaterializedView"]]: NonNullable<DBSchema["formationNonMaterializedView"][K]>;
  };
}
export interface FormationScolaireMaterializedView extends Omit<DBSchema, "formationNonMaterializedView"> {
  formationScolaireView: {
    [K in keyof DBSchema["formationNonMaterializedView"]]: NonNullable<DBSchema["formationNonMaterializedView"][K]>;
  };
}

export interface FormationApprentissageMaterializedView extends Omit<DBSchema, "formationNonMaterializedView"> {
  formationApprentissageView: {
    [K in keyof DBSchema["formationNonMaterializedView"]]: NonNullable<DBSchema["formationNonMaterializedView"][K]>;
  };
}
export interface LatestDemandeMaterializedView extends Omit<DBSchema, "latestDemandeNonMaterializedView"> {
  latestDemandeView: {
    [K in keyof DBSchema["latestDemandeNonMaterializedView"]]: NonNullable<
      DBSchema["latestDemandeNonMaterializedView"][K]
    >;
  };
}

export interface LatestIntentionMaterializedView extends Omit<DBSchema, "latestIntentionNonMaterializedView"> {
  latestIntentionView: {
    [K in keyof DBSchema["latestIntentionNonMaterializedView"]]: NonNullable<
      DBSchema["latestIntentionNonMaterializedView"][K]
    >;
  };
}
export interface LatestDemandeIntentionMaterializedView
  extends Omit<DBSchema, "latestDemandeIntentionNonMaterializedView"> {
  latestDemandeIntentionView: {
    [K in keyof DBSchema["latestDemandeIntentionNonMaterializedView"]]: NonNullable<
      DBSchema["latestDemandeIntentionNonMaterializedView"][K]
    >;
  };
}
export interface DemandeIntentionMaterializedView extends Omit<DBSchema, "demandeIntentionNonMaterializedView"> {
  demandeIntentionView: {
    [K in keyof DBSchema["demandeIntentionNonMaterializedView"]]: NonNullable<
      DBSchema["demandeIntentionNonMaterializedView"][K]
    >;
  };
}

export type DB =
  | FormationMaterializedView
  | FormationScolaireMaterializedView
  | FormationApprentissageMaterializedView
  | LatestDemandeMaterializedView
  | LatestIntentionMaterializedView
  | LatestDemandeIntentionMaterializedView
  | DemandeIntentionMaterializedView;

let kdb: Kysely<DB> | null = null;
let pool: pg.Pool | null = null;

types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT4, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT2, (val) => parseInt(val));
types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));

export const connectToPgDb = async (uri: string) => {
  pool = new Pool({
    connectionString: uri,
    ssl: config.psql.ca ? { rejectUnauthorized: false, ca: config.psql.ca } : undefined,
  });

  pool.on("error", (error) => {
    try {
      console.error("lost connection with DB!");
      logger.error("pg pool lost connexion with database", { error });
      // eslint-disable-next-line no-empty
    } catch (_e) {}
  });

  kdb = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    log: (event) => {
      if (event.level === config.psql.logLevel) {
        console.log(`\n====================================\n`);
        console.log(replaceQueryPlaceholders(event.query.sql, event.query.parameters as string[]));
        console.log({
          parameters: event.query.parameters.map((p, index) => `$${index + 1} = ${p}`).join(", "),
        });
        console.log({ duration: event.queryDurationMillis });
      }
    },
  });

  return kdb;
};

export const ensureInitialization = () => {
  if (!kdb) {
    throw new Error("Database connection does not exist. Please call connectToPgDb before.");
  }
  return kdb;
};

export const getKbdClient = () => ensureInitialization();

export const closePgDbConnection = async () => {
  logger.warn("Closing PSQL");
  if (process.env.NODE_ENV !== "test") {
    // Let 100ms for possible callback cleanup to register tasks in queue
    await sleep(200);
  }
  return pool?.end();
};

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
