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
