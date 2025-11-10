export const BIKES_TABLE_NAME = "bikes";
export const PIECES_TABLE_NAME = "pieces";

// @formatter:off
export const CREATE_BIKE_TABLE = `
    CREATE TABLE IF NOT EXISTS ${BIKES_TABLE_NAME} (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT,
        image BLOB,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;

export const CREATE_PIECE_TABLE = `
    CREATE TABLE IF NOT EXISTS ${PIECES_TABLE_NAME} (
      id INTEGER PRIMARY KEY,
      bike_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      name TEXT,
      brand TEXT,
      model TEXT,
      status TEXT,
      attributes TEXT, -- JSON string to store additional attributes
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (bike_id) REFERENCES ${BIKES_TABLE_NAME}(id) ON DELETE CASCADE
    );
`;
// @formatter:on
