import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeDatabase } from "@/api/services/DatabaseService";
import { SQLiteDatabase } from "expo-sqlite";

interface DatabaseContextType {
  db: SQLiteDatabase | undefined;
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
  const [db, setDb] = useState<SQLiteDatabase | undefined>(undefined);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const initializedDb = await initializeDatabase();
        setDb(initializedDb);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};
