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
  { type_id: 1, name: "Chain", description: "Bike chain" },
  { type_id: 1, name: "Cassette", description: "Rear gear cassette" },
  { type_id: 1, name: "Chainring", description: "Front chainrings" },
  {
    type_id: 1,
    name: "Derailleur",
    description: "Front and rear derailleurs",
  },
  { type_id: 1, name: "Shifters", description: "Gear shifters" },

  // Braking (type_id: 2)
  { type_id: 2, name: "Brake Pads", description: "Disc or rim brake pads" },
  { type_id: 2, name: "Brake Rotors", description: "Disc brake rotors" },
  {
    type_id: 2,
    name: "Brake System",
    description: "Brake caliper and levers",
  },

  // Wheels & Tires (type_id: 3)
  { type_id: 3, name: "Tires", description: "Wheels tires" },

  // Suspension (type_id: 4)
  { type_id: 4, name: "Front Fork", description: "Front suspension fork" },
  { type_id: 4, name: "Rear Shock", description: "Rear suspension shock" },
];

const initialMaintenanceTypes: CreateMaintenanceType[] = [
  {
    name: "Replace",
    description: "Replace worn or damaged component",
    recommended_km: -1,
    recommended_days: -1,
  },
  {
    name: "Bleed",
    description: "Bleed hydraulic system",
    recommended_km: -1,
    recommended_days: 365,
  },
  {
    name: "Revision",
    description: "General maintenance",
    recommended_km: -1,
    recommended_days: 365,
  },
  {
    name: "Tubeless",
    description: "Add sealant in the tire",
    recommended_km: -1,
    recommended_days: 180,
  },
  {
    name: "Inspection",
    description: "Visual inspection for wear and damage",
    recommended_km: 500,
    recommended_days: 30,
  },
  {
    name: "Adjustment",
    description: "Adjust tension, alignment, or settings",
    recommended_km: -1,
    recommended_days: -1,
  },
];

const initialCategoryMaintenanceLinks = [
  // Chain (1): Replace, Inspection, Adjustment
  { category_id: 1, maintenance_type_id: 1 },
  { category_id: 1, maintenance_type_id: 5 },
  { category_id: 1, maintenance_type_id: 6 },

  // Cassette (2): Replace, Inspection
  { category_id: 2, maintenance_type_id: 1 },
  { category_id: 2, maintenance_type_id: 5 },

  // Chainring (3): Replace, Inspection
  { category_id: 3, maintenance_type_id: 1 },
  { category_id: 3, maintenance_type_id: 5 },

  // Derailleur (4): Replace, Adjustment
  { category_id: 4, maintenance_type_id: 1 },
  { category_id: 4, maintenance_type_id: 6 },

  // Shifters (5): Replace, Adjustment
  { category_id: 5, maintenance_type_id: 1 },
  { category_id: 5, maintenance_type_id: 6 },

  // Brake Pads (6): Replace, Inspection
  { category_id: 6, maintenance_type_id: 1 },
  { category_id: 6, maintenance_type_id: 5 },

  // Brake Rotors (7): Replace, Inspection
  { category_id: 7, maintenance_type_id: 1 },
  { category_id: 7, maintenance_type_id: 5 },

  // Brake System (8): Bleed, Inspection, Adjustment
  { category_id: 8, maintenance_type_id: 2 },
  { category_id: 8, maintenance_type_id: 5 },
  { category_id: 8, maintenance_type_id: 6 },

  // Tires (9): Tubeless, Inspection
  { category_id: 9, maintenance_type_id: 4 },
  { category_id: 9, maintenance_type_id: 5 },

  // Front Fork (10): Revision, Inspection, Adjustment
  { category_id: 10, maintenance_type_id: 3 },
  { category_id: 10, maintenance_type_id: 5 },
  { category_id: 10, maintenance_type_id: 6 },

  // Rear Shock (11): Revision, Inspection, Adjustment
  { category_id: 11, maintenance_type_id: 3 },
  { category_id: 11, maintenance_type_id: 5 },
  { category_id: 11, maintenance_type_id: 6 },
];

export {
  initialTypes,
  initialCategories,
  initialMaintenanceTypes,
  initialCategoryMaintenanceLinks,
};
