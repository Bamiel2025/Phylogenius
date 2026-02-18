export enum ActivityState {
  HOME,
  MATRIX,
  CHOICE,
  TREE,
  BOXES,
  QUIZ
}

export interface Species {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  options?: string[]; // If present, matrix uses a cycle/select instead of boolean
  treeLabel?: string; // If present, used for the label in the Tree builder (e.g. "Mandibule Parabolique" vs "Forme mandibule")
}

// Map speciesId -> (characterId -> boolean | string)
export type MatrixData = Record<string, Record<string, boolean | string>>;

// Simple node structure for the tree solution
export interface TreeNode {
  id: string;
  type: 'node' | 'leaf';
  label?: string; // For display if needed
  expectedItemId?: string; // The ID of the species (leaf) or character (node) expected here
  children?: TreeNode[];
  x: number; // For simple visualization relative positioning (0-100)
  y: number;
}

// Box structure for nested boxes
export interface BoxGroup {
  id: string;
  expectedCharacterId?: string; // The character defining this box
  children: (BoxGroup | string)[]; // Can contain other boxes or species IDs
  rect: { x: number; y: number; w: number; h: number; color: string };
}

export interface QuizQuestion {
  question: string;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: string; // Justification displayed after answering
}

export interface Collection {
  id: string;
  name: string;
  subtitle?: string; // New field for the small title (e.g., "Niveau 1")
  description: string;
  thumbnail: string;
  hoverImage?: string; // Image displayed in the info panel when no species is hovered
  species: Species[];
  characters: Character[];
  correctMatrix: MatrixData;
  treeStructure: TreeNode; // Root of the tree topology
  boxStructure: BoxGroup[]; // Top level boxes
  quiz: QuizQuestion; // The final quiz for this collection
}