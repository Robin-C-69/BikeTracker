import { db, getCurrentVersion, setVersion } from "@/database/db";
import {
  CREATE_BIKE_TABLE,
  CREATE_CATEGORY_MAINTENANCE_TYPE_TABLE,
  CREATE_MAINTENANCE_HISTORY_TABLE,
  CREATE_MAINTENANCE_TYPE_TABLE,
  CREATE_PIECE_CATEGORY_TABLE,
  CREATE_PIECE_TABLE,
} from "@/database/migrations/tables";

interface Migration {
  version: number;
  name: string;
  up: () => void;
}

const migration_001: Migration = {
  version: 1,
  name: "initial_setup",
  up: () => {
    db.execSync(CREATE_BIKE_TABLE);
    db.execSync(CREATE_PIECE_CATEGORY_TABLE);
    db.execSync(CREATE_MAINTENANCE_TYPE_TABLE);
    db.execSync(CREATE_CATEGORY_MAINTENANCE_TYPE_TABLE);
    db.execSync(CREATE_MAINTENANCE_HISTORY_TABLE);
    db.execSync(CREATE_PIECE_TABLE);
    console.log("✅ Migration 001 applied: initial_setup");
  },
};

const migrations: Migration[] = [migration_001];

export const runMigrations = (): void => {
  const currentVersion = getCurrentVersion();
  console.log(`📊 Current database version: ${currentVersion}`);

  const pendingMigrations = migrations.filter(
    (migration) => migration.version > currentVersion,
  );

  if (pendingMigrations.length === 0) {
    console.log("✅ No pending migrations. Database is up to date.");
    return;
  }

  console.log(`🚀 Applying ${pendingMigrations.length} pending migrations...`);

  db.withTransactionSync(() => {
    for (const migration of pendingMigrations) {
      console.log(
        `🔄 Applying migration ${migration.version}: ${migration.name}`,
      );
      migration.up();
      setVersion(migration.version);
    }
  });

  console.log(`✅ All migrations completed. New version: ${currentVersion}`);
};
