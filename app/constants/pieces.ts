export type AttributeType = "string" | "number" | "boolean" | "select" | "date";

export interface AttributeDefinition {
  type: AttributeType;
  label: string;
  required: boolean;
  options?: string[]; // For 'select' type
  placeholder?: string;
}

export interface SubCategoryConfig {
  label: string;
  attributes: Record<string, AttributeDefinition>;
  group?: string;
}

export interface ConditionalGroup {
  id: string;
  label: string;
  description?: string;
  selector: {
    label: string;
    options: {
      label: string;
      value: string;
      subcategory: string;
    }[];
  };
}

export interface CategoryConfig {
  label: string;
  icon: string;
  subcategories: Record<string, SubCategoryConfig>;
  conditionalGroups?: ConditionalGroup[];
}

export const PIECE_CATEGORIES = {
  BRAKES: "Brakes",
  DRIVETRAIN: "Drivetrain",
  SUSPENSION: "Suspension",
  WHEELS: "Wheels",
} as const;

export const PIECE_SUBCATEGORIES = {
  // Brakes
  BRAKE_PADS: "Brake Pads",
  DISC_BRAKES: "Disc Brakes",
  RIM_BRAKES: "Rim Brakes",

  // Drivetrain
  CHAIN: "Chain",
  CASSETTE: "Cassette",

  // Suspension
  FRONT_FORK: "Front Fork",
  REAR_SHOCK: "Rear Shock",

  // Wheels
  TIRES_TUBELESS: "Tubeless Tires",
  TIRES_TUBE: "Tube Tires",
} as const;

export const PIECE_STATUSES = {
  NEW: "New",
  GOOD: "Good",
  WORN: "Worn",
  CRITICAL: "Critical",
} as const;

export const ATTRIBUTES_SCHEMA: Record<
  string,
  Record<string, AttributeDefinition>
> = {
  // Brakes
  [PIECE_SUBCATEGORIES.BRAKE_PADS]: {
    material: {
      type: "select",
      label: "Material",
      required: true,
      options: [
        "Composite",
        "Organic",
        "Sintered",
        "Semi-metallic",
        "Metallic",
        "Other",
      ],
    },
    last_changed_date: {
      type: "date",
      label: "Last Changed Date",
      required: false,
      placeholder: "e.g., 2023-01-15",
    },
  },
  [PIECE_SUBCATEGORIES.DISC_BRAKES]: {
    rotorSize: {
      type: "number",
      label: "Rotor Size (mm)",
      required: true,
      placeholder: "e.g., 160",
    },
    pistonCount: {
      type: "number",
      label: "Piston Count",
      required: true,
      placeholder: "e.g., 2",
    },
  },
  [PIECE_SUBCATEGORIES.RIM_BRAKES]: {
    brakeType: {
      type: "select",
      label: "Brake Type",
      required: true,
      options: ["Caliper", "Cantilever", "V-Brake"],
    },
  },

  // Drivetrain
  [PIECE_SUBCATEGORIES.CHAIN]: {
    length: {
      type: "number",
      label: "Length (links)",
      required: true,
      placeholder: "e.g., 116",
    },
    last_changed_date: {
      type: "date",
      label: "Last Changed Date",
      required: false,
      placeholder: "e.g., 2023-01-15",
    },
    last_changed_mileage: {
      type: "number",
      label: "Last Changed Mileage (km)",
      required: false,
      placeholder: "e.g., 1500",
    },
  },
  [PIECE_SUBCATEGORIES.CASSETTE]: {
    speed: {
      type: "number",
      label: "Speed (number of gears)",
      required: true,
      placeholder: "e.g., 11",
    },
    range: {
      type: "string",
      label: "Gear Range",
      required: true,
      placeholder: "e.g., 10-52",
    },
    compatibility: {
      type: "string",
      label: "Compatibility",
      required: false,
      placeholder: "e.g., Shimano",
    },
    last_changed_date: {
      type: "date",
      label: "Last changed date",
      required: false,
      placeholder: "e.g., 2023-01-15",
    },
  },

  // Suspension
  [PIECE_SUBCATEGORIES.FRONT_FORK]: {
    travel: {
      type: "number",
      label: "Travel (mm)",
      required: true,
      placeholder: "e.g., 120",
    },
    type: {
      type: "select",
      label: "Fork Type",
      required: true,
      options: ["Air", "Coil", "Spring"],
    },
    wheelSize: {
      type: "number",
      label: "Wheel Size (inches)",
      required: true,
      placeholder: "e.g., 29",
    },
    last_revision_date: {
      type: "date",
      label: "Last Revision Date",
      required: false,
      placeholder: "e.g., 2023-01-15",
    },
  },
  [PIECE_SUBCATEGORIES.REAR_SHOCK]: {
    travel: {
      type: "number",
      label: "Travel (mm)",
      required: true,
      placeholder: "e.g., 150",
    },
    type: {
      type: "select",
      label: "Shock Type",
      required: true,
      options: ["Air", "Coil"],
    },
    last_revision_date: {
      type: "date",
      label: "Last Revision Date",
      required: false,
      placeholder: "e.g., 2023-01-15",
    },
  },

  // Wheels
  [PIECE_SUBCATEGORIES.TIRES_TUBELESS]: {
    size: {
      type: "string",
      label: "Tire Size",
      required: true,
      placeholder: "e.g., 29x2.3",
    },
    last_filled_date: {
      type: "date",
      label: "Last Filled Date",
      required: false,
      placeholder: "e.g., 2023-01-15",
    },
  },
  [PIECE_SUBCATEGORIES.TIRES_TUBE]: {
    size: {
      type: "string",
      label: "Tire Size",
      required: true,
      placeholder: "e.g., 27.5x2.1",
    },
  },
};

export const CATEGORY_SUBCATEGORY_MAP: Record<string, CategoryConfig> = {
  [PIECE_CATEGORIES.BRAKES]: {
    label: PIECE_CATEGORIES.BRAKES,
    icon: "",
    subcategories: {
      [PIECE_SUBCATEGORIES.BRAKE_PADS]: {
        label: PIECE_SUBCATEGORIES.BRAKE_PADS,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.BRAKE_PADS] || {},
      },
      [PIECE_SUBCATEGORIES.DISC_BRAKES]: {
        label: PIECE_SUBCATEGORIES.DISC_BRAKES,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.DISC_BRAKES] || {},
        group: "brake_system",
      },
      [PIECE_SUBCATEGORIES.RIM_BRAKES]: {
        label: PIECE_SUBCATEGORIES.RIM_BRAKES,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.RIM_BRAKES] || {},
        group: "brake_system",
      },
    },
    conditionalGroups: [
      {
        id: "brake_system",
        label: "Brake System Type",
        description: "Select your type of brake system",
        selector: {
          label: "Brake System",
          options: [
            {
              label: "Disc Brakes",
              value: "disc_brakes",
              subcategory: PIECE_SUBCATEGORIES.DISC_BRAKES,
            },
            {
              label: "Rim Brakes",
              value: "rim_brakes",
              subcategory: PIECE_SUBCATEGORIES.RIM_BRAKES,
            },
          ],
        },
      },
    ],
  },
  [PIECE_CATEGORIES.DRIVETRAIN]: {
    label: PIECE_CATEGORIES.DRIVETRAIN,
    icon: "",
    subcategories: {
      [PIECE_SUBCATEGORIES.CHAIN]: {
        label: PIECE_SUBCATEGORIES.CHAIN,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.CHAIN] || {},
      },
      [PIECE_SUBCATEGORIES.CASSETTE]: {
        label: PIECE_SUBCATEGORIES.CASSETTE,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.CASSETTE] || {},
      },
    },
  },
  [PIECE_CATEGORIES.SUSPENSION]: {
    label: PIECE_CATEGORIES.SUSPENSION,
    icon: "",
    subcategories: {
      [PIECE_SUBCATEGORIES.FRONT_FORK]: {
        label: PIECE_SUBCATEGORIES.FRONT_FORK,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.FRONT_FORK] || {},
      },
      [PIECE_SUBCATEGORIES.REAR_SHOCK]: {
        label: PIECE_SUBCATEGORIES.REAR_SHOCK,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.REAR_SHOCK] || {},
      },
    },
  },
  [PIECE_CATEGORIES.WHEELS]: {
    label: PIECE_CATEGORIES.WHEELS,
    icon: "",
    subcategories: {
      [PIECE_SUBCATEGORIES.TIRES_TUBELESS]: {
        label: PIECE_SUBCATEGORIES.TIRES_TUBELESS,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.TIRES_TUBELESS] || {},
        group: "tire_system",
      },
      [PIECE_SUBCATEGORIES.TIRES_TUBE]: {
        label: PIECE_SUBCATEGORIES.TIRES_TUBE,
        attributes: ATTRIBUTES_SCHEMA[PIECE_SUBCATEGORIES.TIRES_TUBE] || {},
        group: "tire_system",
      },
    },
    conditionalGroups: [
      {
        id: "tire_system",
        label: "Tire System Type",
        description: "Select your type of tire system",
        selector: {
          label: "Tire System",
          options: [
            {
              label: "Tubeless Tires",
              value: "tubeless_tires",
              subcategory: PIECE_SUBCATEGORIES.TIRES_TUBELESS,
            },
            {
              label: "Tube Tires",
              value: "tube_tires",
              subcategory: PIECE_SUBCATEGORIES.TIRES_TUBE,
            },
          ],
        },
      },
    ],
  },
} as const;

//Helper functions
export const getSubcategoryAttributes = (
  subcategory: string,
): Record<string, AttributeDefinition> => {
  return ATTRIBUTES_SCHEMA[subcategory] || {};
};

export const getCategorySubcategories = (category: string): string[] => {
  const categoryConfig = CATEGORY_SUBCATEGORY_MAP[category];
  return categoryConfig ? Object.keys(categoryConfig.subcategories) : [];
};

export const getAllCategories = (): string[] => {
  return Object.keys(CATEGORY_SUBCATEGORY_MAP);
};

export const getConditionalGroups = (category: string): ConditionalGroup[] => {
  return CATEGORY_SUBCATEGORY_MAP[category]?.conditionalGroups || [];
};

export const isSubcategoryInGroup = (
  category: string,
  subcategory: string,
  group: string,
): boolean => {
  const categoryConfig = CATEGORY_SUBCATEGORY_MAP[category];
  const subcategoryConfig = categoryConfig?.subcategories[subcategory];
  return subcategoryConfig?.group === group;
};
