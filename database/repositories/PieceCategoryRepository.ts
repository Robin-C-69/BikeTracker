import { SQLiteDatabase } from "expo-sqlite";
import { Category } from "@/database/models/PieceCategoryModel";
import { PIECE_CATEGORIES_TABLE_NAME } from "@/database/migrations/tables";
import { BaseRepository } from "@/database/repositories/BaseRepository";

export class PieceCategoryRepository extends BaseRepository<Category> {
  constructor(db: SQLiteDatabase) {
    super(db, PIECE_CATEGORIES_TABLE_NAME);
  }
}
