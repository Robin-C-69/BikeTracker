import { BaseRepository } from "@/api/repositories/BaseRepository";
import { IPiece } from "@/api/models/PieceModel";
import { SQLiteDatabase } from "expo-sqlite";
import { PIECES_TABLE_NAME } from "@/api/services/constants/tables";

export class PieceRepository extends BaseRepository<IPiece> {
  constructor(database: SQLiteDatabase) {
    super(database, PIECES_TABLE_NAME);
  }

  async create(pieceData: Omit<IPiece, "id">): Promise<IPiece> {
    return null as any;
  }

  async update(id: number, pieceData: Partial<IPiece>): Promise<IPiece | null> {
    return null as any;
  }
}
