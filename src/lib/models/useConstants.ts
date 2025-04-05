export const API_ROUTES = {
  getCraftingRecipes: 'reddead/craftingRecipes',
  getCraftingRecipe: 'reddead/craftingRecipe/:id',
  createCraftingRecipe: 'reddead/craftingRecipe',
  deleteCraftingRecipe: 'reddead/craftingRecipe/:id'
};

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
  BREWING: 'Brewing',
  BUTCHERING: 'Butchering',
  CARPENTRY: 'Carpentry',
  COOKING: 'Cooking',
  DRUGS: 'Drugs',
  JEWELRYSMITHING: 'JewelrySmithing',
  MEDICAL: 'Medical',
  SURVIVAL: 'Survival',
  TAILORING: 'Tailoring',
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