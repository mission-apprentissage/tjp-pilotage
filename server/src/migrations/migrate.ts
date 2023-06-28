import { Migrator } from "kysely";

import { kdb } from "../db/db";
import { migrations } from "./index";

export async function migrateToLatest(keepAlive?: boolean) {
  const migrator = new Migrator({
    db: kdb,
    provider: { getMigrations: async () => migrations },
  });

  const { error, results } = await migrator.migrateToLatest();
  console.log(results);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  if (!keepAlive) {
    await kdb.destroy();
  }
}
