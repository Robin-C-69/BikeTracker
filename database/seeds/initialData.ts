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
    recommendedKm: -1,
    recommendedDays: -1,
  },
  {
    name: "Bleed",
    description: "Bleed hydraulic system",
    recommendedKm: -1,
    recommendedDays: 365,
  },
  {
    name: "Revision",
    description: "General maintenance",
    recommendedKm: -1,
    recommendedDays: 365,
  },
  {
    name: "Tubeless",
    description: "Add sealant in the tire",
    recommendedKm: -1,
    recommendedDays: 180,
  },
  {
    name: "Inspection",
    description: "Visual inspection for wear and damage",
    recommendedKm: 500,
    recommendedDays: 30,
  },
  {
    name: "Adjustment",
    description: "Adjust tension, alignment, or settings",
    recommendedKm: -1,
    recommendedDays: -1,
  },
];

const initialCategoryMaintenanceLinks = [
  // Chain (1): Replace, Inspection, Adjustment
  { categoryId: 1, maintenanceTypeId: 1 },
  { categoryId: 1, maintenanceTypeId: 5 },
  { categoryId: 1, maintenanceTypeId: 6 },

  // Cassette (2): Replace, Inspection
  { categoryId: 2, maintenanceTypeId: 1 },
  { categoryId: 2, maintenanceTypeId: 5 },

  // Chainring (3): Replace, Inspection
  { categoryId: 3, maintenanceTypeId: 1 },
  { categoryId: 3, maintenanceTypeId: 5 },

  // Derailleur (4): Replace, Adjustment
  { categoryId: 4, maintenanceTypeId: 1 },
  { categoryId: 4, maintenanceTypeId: 6 },

  // Shifters (5): Replace, Adjustment
  { categoryId: 5, maintenanceTypeId: 1 },
  { categoryId: 5, maintenanceTypeId: 6 },

  // Brake Pads (6): Replace, Inspection
  { categoryId: 6, maintenanceTypeId: 1 },
  { categoryId: 6, maintenanceTypeId: 5 },

  // Brake Rotors (7): Replace, Inspection
  { categoryId: 7, maintenanceTypeId: 1 },
  { categoryId: 7, maintenanceTypeId: 5 },

  // Brake System (8): Bleed, Inspection, Adjustment
  { categoryId: 8, maintenanceTypeId: 2 },
  { categoryId: 8, maintenanceTypeId: 5 },
  { categoryId: 8, maintenanceTypeId: 6 },

  // Tires (9): Tubeless, Inspection
  { categoryId: 9, maintenanceTypeId: 4 },
  { categoryId: 9, maintenanceTypeId: 5 },

  // Front Fork (10): Revision, Inspection, Adjustment
  { categoryId: 10, maintenanceTypeId: 3 },
  { categoryId: 10, maintenanceTypeId: 5 },
  { categoryId: 10, maintenanceTypeId: 6 },

  // Rear Shock (11): Revision, Inspection, Adjustment
  { categoryId: 11, maintenanceTypeId: 3 },
  { categoryId: 11, maintenanceTypeId: 5 },
  { categoryId: 11, maintenanceTypeId: 6 },
];

export {
  initialTypes,
  initialCategories,
  initialMaintenanceTypes,
  initialCategoryMaintenanceLinks,
};
