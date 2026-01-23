export const BIKES_TABLE_NAME = "bikes";

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
// @formatter:on
