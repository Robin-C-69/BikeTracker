import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("biketracker.db");
db.execSync("PRAGMA foreign_keys = ON;");

export const setVersion = (version: number): void => {
  db.execSync(`PRAGMA user_version = ${version};`);
};

export const getCurrentVersion = (): number => {
  try {
    const result = db.getFirstSync<{ user_version: number }>(
      `PRAGMA user_version;`,
    );
    return result?.user_version || 0;
  } catch {
    return 0;
  }
};
