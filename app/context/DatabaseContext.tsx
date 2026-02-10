import React, { createContext, useContext, useEffect, useState } from "react";
import { SQLiteDatabase } from "expo-sqlite";
import { runMigrations } from "@/database/migrations";
import { db } from "@/database/db";

interface DatabaseContextType {
  db: SQLiteDatabase | undefined;
  isReady: boolean;
}

interface DatabaseProviderProps {
  children: React.ReactNode;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupDatabase = () => {
      try {
        runMigrations();
        setIsReady(true);
        console.log("Database is ready");
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    setupDatabase();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <DatabaseContext.Provider value={{ db, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};
