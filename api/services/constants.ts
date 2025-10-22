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
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        brand TEXT,
        state TEXT CHECK (
            state IN ('Neuf', 'Excellent', 'Bon', 'Moyen', 'Usé', 'HS')
        ),
        notes TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;
// @formatter:on
