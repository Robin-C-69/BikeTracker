import { SQLiteDatabase } from "expo-sqlite";

interface IBaseRepository<T> {
  findAll(limit?: number, offset?: number): Promise<T[]>;

  findById(id: number): Promise<T | null>;

  deleteById(id: number): Promise<void>;

  create(data: Omit<T, "id">): Promise<number>;

  update(id: number, data: Partial<T>): Promise<number>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected db: SQLiteDatabase;
  protected tableName: string;

  protected constructor(db: SQLiteDatabase, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  async findAll(limit?: number, offset?: number): Promise<T[]> {
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
  }

  async findById(id: number): Promise<T | null> {
    const result = await this.db.getFirstAsync(
      `SELECT *
       FROM ${this.tableName}
       WHERE id = ?`,
      id,
    );
    return (result as T) || null;
  }

  async deleteById(id: number): Promise<void> {
    await this.db.runAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  // Abstract methods to be implemented by child classes
  abstract create(data: Omit<T, "id">): Promise<number>;

  abstract update(id: number, data: Partial<T>): Promise<number>;
}
