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
  }
];

/**
 * Get a book by its ID
 * @param id Book ID to find
 * @returns The book object or undefined if not found
 */
export function getBookById(id: string): Book | undefined {
  return AVAILABLE_BOOKS.find(book => book.id === id);
}

/**
 * Add a new book to the available books list
 * @param book Book object to add
 */
export function addBook(book: Book): void {
  // Check if book with same ID already exists
  const existingIndex = AVAILABLE_BOOKS.findIndex(b => b.id === book.id);
  
  if (existingIndex >= 0) {
    // Replace existing book
    AVAILABLE_BOOKS[existingIndex] = book;
  } else {
    // Add new book
    AVAILABLE_BOOKS.push(book);
  }
}
