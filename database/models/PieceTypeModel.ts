/**
 * A type is a group of category.
 * It groups pieces related to the same element.
 * Eg: 'Transmission' type contains 'Chain' and 'Cassette' categories.
 */
export type PieceType = {
  id: number;
  name: string;
  description: string;
};

export type CreatePieceType = {
  name: string;
  description: string;
};
