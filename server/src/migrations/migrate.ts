import { Migrator, sql } from "kysely";

import { kdb } from "../db/db";
import { migrations } from "./index";

export async function migrateToLatest(keepAlive?: boolean) {
  const migrator = new Migrator({
    db: kdb,
    provider: { getMigrations: async () => migrations },
  });

  const knownMigrations = await migrator.getMigrations();

  const dbMigrations = await sql<{
    name: string;
    timestamp: string;
  }>`SELECT * FROM kysely_migration;`.execute(kdb);

  const toDelete = dbMigrations.rows.filter(
    (migration) => !knownMigrations.some(({ name }) => name === migration.name)
  );

  if (toDelete.length) {
    console.log(`warning: unknown past migrations`, toDelete);
    await sql`DELETE FROM kysely_migration where name in (${sql.join(
      toDelete.map((item) => item.name)
    )})`.execute(kdb);
  }

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (!results?.length) {
    console.log("already up to date !");
  }

  for (const migration of toDelete) {
    try {
      await sql`INSERT INTO kysely_migration (name,timestamp) values (${migration.name},${migration.timestamp})`.execute(
        kdb
      );
    } catch (e) {
      console.error(
        `failed to reinsert (${migration.name}, ${migration.timestamp})`
      );
    }
  }

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  if (!keepAlive) {
    await kdb.destroy();
  }
}
