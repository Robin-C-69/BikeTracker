import { SQLiteDatabase } from "expo-sqlite";
import { Category } from "@/database/models/PieceCategoryModel";
import { PIECE_CATEGORIES_TABLE_NAME } from "@/database/migrations/tables";

export class PieceCategoryRepository {
  protected db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async findAllCategories(): Promise<Category[]> {
    const results = await this.db.getAllAsync(
      `SELECT *
       FROM ${PIECE_CATEGORIES_TABLE_NAME}
       ORDER BY name ASC`,
    );
    return results as Category[];
  }

  async findCategoryById(id: number): Promise<Category | null> {
    const result = await this.db.getFirstAsync(
      `SELECT *
       FROM ${PIECE_CATEGORIES_TABLE_NAME}
       WHERE id = ?`,
      id,
    );
    return (result as Category) || null;
  }
}
