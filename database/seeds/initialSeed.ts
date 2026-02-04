import { db } from "@/database/db";
import {
  CATEGORY_MAINTENANCE_TYPE_TABLE_NAME,
  MAINTENANCE_TYPE_TABLE_NAME,
  PIECE_CATEGORIES_TABLE_NAME,
  PIECE_TYPES_TABLE_NAME,
} from "@/database/migrations/tables";
import {
  initialCategories,
  initialCategoryMaintenanceLinks,
  initialMaintenanceTypes,
  initialTypes,
} from "@/database/seeds/initialData";

const isSeeded = (db: any): boolean => {
  try {
    const result = db.getFirstSync(
      `SELECT COUNT(*) as count FROM ${PIECE_CATEGORIES_TABLE_NAME}`,
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.log("Error checking if seeded:", error);
    return false;
  }
};

export const seedInitialData = (): void => {
  if (isSeeded(db)) {
    console.log("📊 Database already seeded. Skipping initial data seeding.");
    return;
  }

  console.log("🌱 Seeding initial data...");

  try {
    // Insert without transaction wrapper
    initialTypes.forEach((type) => {
      db.runSync(
        `INSERT INTO ${PIECE_TYPES_TABLE_NAME} (name, description) VALUES (?, ?)`,
        [type.name, type.description],
      );
    });

    console.log(`✅ Inserted ${initialTypes.length} piece types`);

    initialCategories.forEach((category) => {
      db.runSync(
        `INSERT INTO ${PIECE_CATEGORIES_TABLE_NAME} (type_id, name, description) VALUES (?, ?, ?)`,
        [category.type_id, category.name, category.description],
      );
    });
    console.log(`✅ Inserted ${initialCategories.length} piece categories`);

    initialMaintenanceTypes.forEach((type) => {
      db.runSync(
        `INSERT INTO ${MAINTENANCE_TYPE_TABLE_NAME} (name, description, recommended_km, recommended_days) 
         VALUES (?, ?, ?, ?)`,
        [
          type.name,
          type.description,
          type.recommended_km,
          type.recommended_days,
        ],
      );
    });

    console.log(
      `✅ Inserted ${initialMaintenanceTypes.length} maintenance types`,
    );

    initialCategoryMaintenanceLinks.forEach((cat) => {
      db.runSync(
        `INSERT INTO ${CATEGORY_MAINTENANCE_TYPE_TABLE_NAME} (category_id, maintenance_type_id) VALUES (?, ?)`,
        [cat.category_id, cat.maintenance_type_id],
      );
    });
    console.log(
      `✅ Created ${initialCategoryMaintenanceLinks.length} category-maintenance links`,
    );

    console.log("🌱 Initial data seeding completed.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
};
