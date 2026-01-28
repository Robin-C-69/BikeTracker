import * as SQLite from "expo-sqlite";
import { CREATE_BIKE_TABLE } from "@/database/services/constants/tables";

export const db = await SQLite.openDatabaseAsync("biketracker.db");

export const initializeDatabase = async () => {
  try {
    // Enable foreign key constraints
    await db.execAsync("PRAGMA foreign_keys = ON;");

    db.execSync(CREATE_BIKE_TABLE);

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
