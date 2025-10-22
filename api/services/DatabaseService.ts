import * as SQLite from "expo-sqlite";
import {
  CREATE_BIKE_TABLE,
  CREATE_PIECE_TABLE,
} from "@/api/services/constants";

export const initializeDatabase = async () => {
  try {
    // Open/create database
    const db = await SQLite.openDatabaseAsync("biketracker.db");

    // Enable foreign key constraints
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Create tables
    await db.execAsync(CREATE_BIKE_TABLE);
    // await db.execAsync(CREATE_PIECE_TABLE);

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
