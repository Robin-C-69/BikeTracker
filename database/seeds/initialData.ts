import { CreatePieceType } from "@/database/models/PieceTypeModel";
import { CreateCategory } from "@/database/models/PieceCategoryModel";
import { CreateMaintenanceType } from "@/database/models/MaintenanceTypeModel";

const initialTypes: CreatePieceType[] = [
  {
    name: "Transmission",
    description: "Drivetrain and power transfer components",
  },
  { name: "Braking", description: "Braking system components" },
  {
    name: "Wheels & Tires",
    description: "Wheels, tires, and related components",
  },
  { name: "Suspension", description: "Suspension and shock components" },
];

const initialCategories: CreateCategory[] = [
  // Transmission (type_id: 1)
  { typeId: 1, name: "Chain", description: "Bike chain" },
  { typeId: 1, name: "Cassette", description: "Rear gear cassette" },
  { typeId: 1, name: "Chainring", description: "Front chainrings" },
  {
    typeId: 1,
    name: "Derailleur",
    description: "Front and rear derailleurs",
  },
  { typeId: 1, name: "Shifters", description: "Gear shifters" },

  // Braking (type_id: 2)
  { typeId: 2, name: "Brake Pads", description: "Disc or rim brake pads" },
  { typeId: 2, name: "Brake Rotors", description: "Disc brake rotors" },
  {
    typeId: 2,
    name: "Brake System",
    description: "Brake caliper and levers",
  },

  // Wheels & Tires (typeId: 3)
  { typeId: 3, name: "Tires", description: "Wheels tires" },

  // Suspension (typeId: 4)
  { typeId: 4, name: "Front Fork", description: "Front suspension fork" },
  { typeId: 4, name: "Rear Shock", description: "Rear suspension shock" },
];

const initialMaintenanceTypes: CreateMaintenanceType[] = [
  {
    name: "Replace",
    description: "Replace worn or damaged component",
    isCritical: true,
  },
  {
    name: "Bleed",
    description: "Bleed hydraulic system",
    isCritical: true,
  },
  {
    name: "Revision",
    description: "General maintenance",
    isCritical: true,
  },
  {
    name: "Tubeless",
    description: "Add sealant in the tire",
    isCritical: false,
  },
  {
    name: "Inspection",
    description: "Visual inspection for wear and damage",
    isCritical: false,
  },
  {
    name: "Adjustment",
    description: "Adjust tension, alignment, or settings",
    isCritical: false,
  },
];

const initialCategoryMaintenanceLinks = [
  // ── Chain (1) ──────────────────────────────────────────────────────────────
  // Chains wear fast; replace yearly or ~2000 km, inspect every 500 km
  {
    categoryId: 1,
    maintenanceTypeId: 1,
    recommendedKm: 2000,
    recommendedDays: 365,
  }, // Replace
  {
    categoryId: 1,
    maintenanceTypeId: 5,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Inspection
  {
    categoryId: 1,
    maintenanceTypeId: 6,
    recommendedKm: null,
    recommendedDays: null,
  }, // Adjustment (on demand)

  // ── Cassette (2) ───────────────────────────────────────────────────────────
  // Cassettes last ~2–3 chains; replace every ~2 years or 4000 km
  {
    categoryId: 2,
    maintenanceTypeId: 1,
    recommendedKm: 4000,
    recommendedDays: 728,
  }, // Replace
  {
    categoryId: 2,
    maintenanceTypeId: 5,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Inspection

  // ── Chainring (3) ──────────────────────────────────────────────────────────
  // Chainrings wear slower; replace every ~3 years or 6000 km
  {
    categoryId: 3,
    maintenanceTypeId: 1,
    recommendedKm: 6000,
    recommendedDays: null,
  }, // Replace
  {
    categoryId: 3,
    maintenanceTypeId: 5,
    recommendedKm: 1000,
    recommendedDays: null,
  }, // Inspection

  // ── Derailleur (4) ─────────────────────────────────────────────────────────
  // No fixed lifespan; replace on damage, adjust regularly
  {
    categoryId: 4,
    maintenanceTypeId: 1,
    recommendedKm: null,
    recommendedDays: null,
  }, // Replace (on demand)
  {
    categoryId: 4,
    maintenanceTypeId: 6,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Adjustment

  // ── Shifters (5) ───────────────────────────────────────────────────────────
  // No fixed lifespan; replace on damage, adjust regularly
  {
    categoryId: 5,
    maintenanceTypeId: 1,
    recommendedKm: null,
    recommendedDays: null,
  }, // Replace (on demand)
  {
    categoryId: 5,
    maintenanceTypeId: 6,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Adjustment

  // ── Brake Pads (6) ─────────────────────────────────────────────────────────
  // Highly dependent on conditions; inspect every 500 km
  {
    categoryId: 6,
    maintenanceTypeId: 1,
    recommendedKm: null,
    recommendedDays: null,
  }, // Replace (wear-based)
  {
    categoryId: 6,
    maintenanceTypeId: 5,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Inspection

  // ── Brake Rotors (7) ───────────────────────────────────────────────────────
  // Long lifespan; replace every ~3 years or 5000 km
  {
    categoryId: 7,
    maintenanceTypeId: 1,
    recommendedKm: 5000,
    recommendedDays: null,
  }, // Replace
  {
    categoryId: 7,
    maintenanceTypeId: 5,
    recommendedKm: 1000,
    recommendedDays: null,
  }, // Inspection

  // ── Brake System (8) ───────────────────────────────────────────────────────
  // Bleed hydraulics yearly; inspect regularly
  {
    categoryId: 8,
    maintenanceTypeId: 2,
    recommendedKm: null,
    recommendedDays: 365,
  }, // Bleed
  {
    categoryId: 8,
    maintenanceTypeId: 5,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Inspection
  {
    categoryId: 8,
    maintenanceTypeId: 6,
    recommendedKm: null,
    recommendedDays: null,
  }, // Adjustment (on demand)

  // ── Tires (9) ──────────────────────────────────────────────────────────────
  // Refresh tubeless sealant every 6 months; inspect every ride / 200 km
  {
    categoryId: 9,
    maintenanceTypeId: 4,
    recommendedKm: null,
    recommendedDays: 180,
  }, // Tubeless
  {
    categoryId: 9,
    maintenanceTypeId: 5,
    recommendedKm: 200,
    recommendedDays: null,
  }, // Inspection

  // ── Front Fork (10) ────────────────────────────────────────────────────────
  // Full service (lowers + damper) every year or 125 h riding
  {
    categoryId: 10,
    maintenanceTypeId: 3,
    recommendedKm: null,
    recommendedDays: 365,
  }, // Revision
  {
    categoryId: 10,
    maintenanceTypeId: 5,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Inspection
  {
    categoryId: 10,
    maintenanceTypeId: 6,
    recommendedKm: null,
    recommendedDays: null,
  }, // Adjustment (on demand)

  // ── Rear Shock (11) ────────────────────────────────────────────────────────
  // Full service every year or 125 h riding
  {
    categoryId: 11,
    maintenanceTypeId: 3,
    recommendedKm: null,
    recommendedDays: 365,
  }, // Revision
  {
    categoryId: 11,
    maintenanceTypeId: 5,
    recommendedKm: 500,
    recommendedDays: null,
  }, // Inspection
  {
    categoryId: 11,
    maintenanceTypeId: 6,
    recommendedKm: null,
    recommendedDays: null,
  }, // Adjustment (on demand)
];

export {
  initialTypes,
  initialCategories,
  initialMaintenanceTypes,
  initialCategoryMaintenanceLinks,
};
