import {SQLiteDatabase} from "expo-sqlite";

interface IBaseRepository<T> {
  findAll(limit?: number, offset?: number): Promise<T[]>;

  findById(id: number): Promise<T | null>;

  deleteById(id: number): Promise<boolean>;

  count(): Promise<number>;

  create(data: Omit<T, 'id'>): Promise<T>;

  update(id: number, data: Partial<T>): Promise<T | null>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected db: SQLiteDatabase;
  protected tableName: string;

  protected constructor(db: SQLiteDatabase, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  async findAll(limit?: number, offset?: number): Promise<T[]> {
    try {
      let query = `SELECT *
                   FROM ${this.tableName}
                   ORDER BY id DESC`;
      const params: any[] = [];

      if (limit) {
        query += ` LIMIT ?`;
        params.push(limit);
        if (offset) {
          query += ` OFFSET ?`;
          params.push(offset);
        }
      }

      const results = await this.db.getAllAsync(query, params);
      return results as T[];

    } catch (error) {
      console.error(`Error fetching all records from ${this.tableName}:`, error);
      throw error;
    }
  }

  async findById(id: number): Promise<T | null> {
    try {
      const result = await this.db.getFirstAsync(`SELECT *
                                                  FROM ${this.tableName}
                                                  WHERE id = ?`, id);
      return result as T || null;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} with id ${id}`);
      throw error;
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const result = await this.db.getFirstAsync(`DELETE
                                                  FROM ${this.tableName}
                                                  WHERE id = ?`, id);
      return (result as { changes: number }).changes > 0;
    } catch (error) {
      console.error(`Error deleting ${this.tableName} with id ${id}`);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const result = await this.db.getFirstAsync(
        `SELECT COUNT(*) as count
         FROM ${this.tableName}`
      ) as { count: number };
      return result.count;
    } catch (error) {
      console.error(`Error counting ${this.tableName}:`, error);
      throw error;
    }
  }

  // Abstract methods to be implemented by child classes
  abstract create(data: Omit<T, 'id'>): Promise<T>;

  abstract update(id: number, data: Partial<T>): Promise<T | null>;
}