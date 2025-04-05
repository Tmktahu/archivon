/**
 * Book definitions for the cipher application
 * This file centralizes all book-related constants for easy management
 */

/**
 * Interface for Book object
 */
export interface Book {
  id: string;
  name: string;
  author: string;
  filename: string;
  description?: string;
}

/**
 * Available books for cipher encoding/decoding
 */
export const AVAILABLE_BOOKS: Book[] = [
  { 
    id: 'flowers', 
    name: 'The Language of Flowers', 
    author: 'Kate Greenaway',
    filename: 'flowers.txt',
    description: 'A Victorian-era guide to the symbolic meanings of flowers and plants.'
  },
  { 
    id: 'alice', 
    name: 'Alice\'s Adventures in Wonderland', 
    author: 'Lewis Carroll',
    filename: 'alice.txt',
    description: 'The classic tale of a girl named Alice who falls through a rabbit hole into a fantasy world.'
  },
  { 
    id: 'dracula', 
    name: 'Dracula', 
    author: 'Bram Stoker',
    filename: 'dracula.txt',
    description: 'The classic Gothic horror novel about Count Dracula\'s attempt to move from Transylvania to England.'
  },
  { 
    id: 'grimm', 
    name: 'Grimm\'s Fairy Tales', 
    author: 'The Brothers Grimm',
    filename: 'grimm.txt',
    description: 'A collection of fairy tales by the German brothers Jacob and Wilhelm Grimm.'
  },
  { 
    id: 'moby', 
    name: 'Moby Dick', 
    author: 'Herman Melville',
    filename: 'moby.txt',
    description: 'The story of Captain Ahab\'s quest for revenge on the white whale, Moby Dick.'
  },
  { 
    id: 'odyssey', 
    name: 'The Odyssey', 
    author: 'Homer',
    filename: 'odyssey.txt',
    description: 'The ancient Greek epic poem following Odysseus\'s journey home after the Trojan War.'
  },
  { 
    id: 'bible', 
    name: 'The Bible', 
    author: 'Various',
    filename: 'bible.txt',
    description: 'A collection of religious texts sacred in Christianity, Judaism, and other religions.'
  },
  { 
    id: 'solomon', 
    name: 'The Key of Solomon', 
    author: 'Unknown',
    filename: 'solomon.txt',
    description: 'A medieval grimoire attributed to King Solomon containing instructions for summoning spirits.'
  },
  { 
    id: 'sherlock', 
    name: 'The Adventures of Sherlock Holmes', 
    author: 'Arthur Conan Doyle',
    filename: 'sherlock.txt',
    description: 'A collection of twelve short stories featuring the famous detective Sherlock Holmes.'
  },
  { 
    id: 'cowboy', 
    name: 'The Log of a Cowboy', 
    author: 'Andy Adams',
    filename: 'cowboy.txt',
    description: 'A narrative of the old trail days, following cattle drives in the American West.'
  }
];

/**
 * Interface for CraftingComponent object
 */
export interface CraftingComponent {
  name: string;
  amount: number;
}

/**
 * Crafting categories
 */
export const CRAFTING_CATEGORIES = {
  BASIC: 'Basic',
  BLACKSMITHING: 'Blacksmithing',
  COOKING: 'Cooking',
  DRUGS: 'Drugs',
  CARPENTRY: 'Carpentry',
  MEDICAL: 'Medical',
  TAILORING: 'Tailoring',
  JEWELRYSMITHING: 'JewelrySmithing',
  GUNSMITHING: 'Gunsmithing'
};

/**
 * Crafting jobs
 */
export const CRAFTING_JOBS = {
  NONE: 'None',
  BLACKSMITH: 'Blacksmith',
  GUNSMITH: 'Gunsmith',
  DOCTOR: 'Doctor'
};

/**
 * Interface for Item object
 */
export interface Item {
  name: string;
}

/**
 * Available items for crafting
 */
export const AVAILABLE_ITEMS: Record<string, Item> = {
  PAPER: { name: "Paper" },
  PIPE: { name: "Pipe" },
  EMPTY_BOWL: { name: "Empty Bowl" },
  BOWL_OF_CLEAN_WATER: { name: "Bowl of Clean Water" },
  IRON_BAR: { name: "Iron Bar" },
  IRON_BARS: { name: "Iron Bars" },
  IRON_HAMMER: { name: "Iron Hammer" },
  CLAY: { name: "Clay" },
  WATERINGCAN: { name: "Wateringcan" },
  HARD_WOOD: { name: "Hard Wood" },
  HARDWOOD: { name: "Hardwood" },
  SAP: { name: "Sap" },
  COPPER: { name: "Copper" },
  WOOD: { name: "Wood" },
  NAILS: { name: "Nails" },
  BOLTS: { name: "Bolts" },
  SHELL_CASING: { name: "Shell Casing" },
  REVOLVER_MOLD: { name: "Revolver Mold" },
  REVOLVER_BARREL: { name: "Revolver Barrel" },
  REVOLVER_CYLINDER: { name: "Revolver Cylinder" },
  REVOLVER_HANDLE: { name: "Revolver Handle" },
  HATCHET: { name: "Hatchet" },
  GLASS_BOTTLES: { name: "Glass Bottles" },
  PILE_OF_BRICKS: { name: "Pile of Bricks" },
  PANES_OF_GLASS: { name: "Panes of Glass" },
  MORTAR_AND_PESTLE: { name: "Mortar and Pestle" },
  PULP: { name: "Pulp" },
  ROCK: { name: "Rock" },
  BOWL_OF_DIRTY_WATER: { name: "Bowl of Dirty Water" },
  WATER_JUG: { name: "Water Jug" },
  IRON_ORE: { name: "Iron Ore" },
  COAL: { name: "Coal" }
};

/**
 * Interface for CraftingRecipe object
 */
export interface CraftingRecipe {
  name: string;
  amount: number;
  components: CraftingComponent[];
  experience: number;
  category: string;
  requiredJob: string;
}

/**
 * Available crafting recipes
 */
export const AVAILABLE_RECIPES: CraftingRecipe[] = [
  {
    name: AVAILABLE_ITEMS.PAPER.name,
    amount: 5,
    components: [
      { name: AVAILABLE_ITEMS.PULP.name, amount: 5 },
      { name: AVAILABLE_ITEMS.WATER_JUG.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BASIC,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.PIPE.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.WOOD.name, amount: 2 },
      { name: AVAILABLE_ITEMS.CLAY.name, amount: 1 },
      { name: AVAILABLE_ITEMS.COPPER.name, amount: 2 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BASIC,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.EMPTY_BOWL.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.HARD_WOOD.name, amount: 5 },
      { name: AVAILABLE_ITEMS.SAP.name, amount: 2 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BASIC,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.BOWL_OF_CLEAN_WATER.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.BOWL_OF_DIRTY_WATER.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BASIC,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.IRON_BARS.name,
    amount: 5,
    components: [
      { name: AVAILABLE_ITEMS.IRON_ORE.name, amount: 5 },
      { name: AVAILABLE_ITEMS.COAL.name, amount: 2 },
      { name: AVAILABLE_ITEMS.IRON_HAMMER.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.NAILS.name,
    amount: 10,
    components: [
      { name: AVAILABLE_ITEMS.IRON_BAR.name, amount: 1 },
      { name: AVAILABLE_ITEMS.IRON_HAMMER.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.BOLTS.name,
    amount: 10,
    components: [
      { name: AVAILABLE_ITEMS.IRON_BAR.name, amount: 1 },
      { name: AVAILABLE_ITEMS.IRON_HAMMER.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.SHELL_CASING.name,
    amount: 24,
    components: [
      { name: AVAILABLE_ITEMS.IRON_BAR.name, amount: 2 },
      { name: AVAILABLE_ITEMS.IRON_HAMMER.name, amount: 1 },
      { name: AVAILABLE_ITEMS.COPPER.name, amount: 6 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.REVOLVER_MOLD.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.CLAY.name, amount: 5 },
      { name: AVAILABLE_ITEMS.WATERINGCAN.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.REVOLVER_BARREL.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.IRON_BAR.name, amount: 8 },
      { name: AVAILABLE_ITEMS.IRON_HAMMER.name, amount: 1 },
      { name: AVAILABLE_ITEMS.REVOLVER_MOLD.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.REVOLVER_CYLINDER.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.IRON_BAR.name, amount: 5 },
      { name: AVAILABLE_ITEMS.IRON_HAMMER.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.REVOLVER_HANDLE.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.HARD_WOOD.name, amount: 5 },
      { name: AVAILABLE_ITEMS.SAP.name, amount: 4 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.IRON_HAMMER.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.IRON_ORE.name, amount: 10 },
      { name: AVAILABLE_ITEMS.HARD_WOOD.name, amount: 2 },
      { name: AVAILABLE_ITEMS.COPPER.name, amount: 10 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.GLASS_BOTTLES.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.ROCK.name, amount: 5 },
      { name: AVAILABLE_ITEMS.CLAY.name, amount: 2 },
      { name: AVAILABLE_ITEMS.BOWL_OF_CLEAN_WATER.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
  {
    name: AVAILABLE_ITEMS.PANES_OF_GLASS.name,
    amount: 1,
    components: [
      { name: AVAILABLE_ITEMS.ROCK.name, amount: 5 },
      { name: AVAILABLE_ITEMS.MORTAR_AND_PESTLE.name, amount: 1 }
    ],
    experience: -1,
    category: CRAFTING_CATEGORIES.BLACKSMITHING,
    requiredJob: CRAFTING_JOBS.NONE
  },
];