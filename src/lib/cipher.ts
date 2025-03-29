/**
 * Book Cipher implementation with keyword shifting
 * This module provides functions to encode and decode messages using a book cipher
 * with an additional layer of security through keyword-based shifting.
 */

/**
 * Parses the book content into pages and lines for easier reference
 */
export interface ParsedBook {
  pages: {
    pageNumber: number;
    lines: string[];
  }[];
}

/**
 * Parse book content into a structured format
 * @param content Raw book content as string
 * @returns Parsed book with pages and lines
 */
export function parseBookContent(content: string): ParsedBook {
  const lines = content.split('\n');
  const pages: ParsedBook['pages'] = [];
  
  let currentPage: ParsedBook['pages'][0] | null = null;
  
  for (const line of lines) {
    // Check if this is a page marker
    const pageMatch = line.trim().match(/^Page\s+(\d+)$/i);
    
    if (pageMatch) {
      // Start a new page
      const pageNumber = parseInt(pageMatch[1], 10);
      currentPage = { pageNumber, lines: [] };
      pages.push(currentPage);
    } else if (currentPage) {
      // Add line to current page
      currentPage.lines.push(line.trim());
    }
  }
  
  return { pages };
}

/**
 * Generates a numeric seed from a keyword
 * @param keyword The keyword to generate a seed from
 * @returns A numeric seed value
 */
export function generateSeedFromKeyword(keyword: string): number {
  // Simple hash function to convert the keyword to a number
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Finds a word in the book and returns its location
 * @param book Parsed book content
 * @param word Word to find
 * @param seed Seed for shifting the starting position
 * @returns Location in format "page-line-word" or null if not found
 */
export function findWordInBook(book: ParsedBook, word: string, seed: number): string | null {
  const normalizedWord = word.toLowerCase().replace(/[^\w]/g, '');
  if (!normalizedWord) return null;
  
  // Determine starting position based on seed
  const totalPages = book.pages.length;
  if (totalPages === 0) return null;
  
  // Use seed to determine starting page
  const startPageIndex = seed % totalPages;
  
  // Search from the starting page to the end, then from beginning to the starting page
  for (let i = 0; i < totalPages; i++) {
    const pageIndex = (startPageIndex + i) % totalPages;
    const page = book.pages[pageIndex];
    
    for (let lineIndex = 0; lineIndex < page.lines.length; lineIndex++) {
      const line = page.lines[lineIndex];
      const words = line.split(/\s+/).map(w => w.toLowerCase().replace(/[^\w]/g, ''));
      
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        if (words[wordIndex] === normalizedWord) {
          // Found the word - return its location (1-based for human readability)
          return `${page.pageNumber}-${lineIndex + 1}-${wordIndex + 1}`;
        }
      }
    }
  }
  
  return null;
}

/**
 * Finds a letter in the book and returns its location
 * @param book Parsed book content
 * @param letter Letter to find
 * @param seed Seed for shifting the starting position
 * @returns Location in format "L:page-line-word-char" or null if not found
 */
export function findLetterInBook(book: ParsedBook, letter: string, seed: number): string | null {
  const normalizedLetter = letter.toLowerCase();
  if (!normalizedLetter.match(/[a-z0-9]/)) return null;
  
  // Determine starting position based on seed
  const totalPages = book.pages.length;
  if (totalPages === 0) return null;
  
  // Use seed to determine starting page
  const startPageIndex = seed % totalPages;
  
  // Search from the starting page to the end, then from beginning to the starting page
  for (let i = 0; i < totalPages; i++) {
    const pageIndex = (startPageIndex + i) % totalPages;
    const page = book.pages[pageIndex];
    
    for (let lineIndex = 0; lineIndex < page.lines.length; lineIndex++) {
      const line = page.lines[lineIndex];
      const words = line.split(/\s+/);
      
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex];
        
        for (let charIndex = 0; charIndex < word.length; charIndex++) {
          const char = word[charIndex].toLowerCase();
          
          if (char === normalizedLetter) {
            // Found the letter - return its location (1-based for human readability)
            return `L:${page.pageNumber}-${lineIndex + 1}-${wordIndex + 1}-${charIndex + 1}`;
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Gets a word from the book based on its location
 * @param book Parsed book content
 * @param location Location in format "page-line-word"
 * @returns The word at the specified location or null if invalid
 */
export function getWordFromLocation(book: ParsedBook, location: string): string | null {
  const parts = location.split('-');
  if (parts.length !== 3) return null;
  
  const pageNumber = parseInt(parts[0], 10);
  const lineNumber = parseInt(parts[1], 10);
  const wordNumber = parseInt(parts[2], 10);
  
  // Find the page
  const page = book.pages.find(p => p.pageNumber === pageNumber);
  if (!page) return null;
  
  // Get the line (convert from 1-based to 0-based)
  const lineIndex = lineNumber - 1;
  if (lineIndex < 0 || lineIndex >= page.lines.length) return null;
  
  // Get the word (convert from 1-based to 0-based)
  const line = page.lines[lineIndex];
  const words = line.split(/\s+/);
  const wordIndex = wordNumber - 1;
  
  if (wordIndex < 0 || wordIndex >= words.length) return null;
  
  return words[wordIndex].toLowerCase().replace(/[^\w]/g, '');
}

/**
 * Gets a letter from the book based on its location
 * @param book Parsed book content
 * @param location Location in format "L:page-line-word-char"
 * @returns The letter at the specified location or null if invalid
 */
export function getLetterFromLocation(book: ParsedBook, location: string): string | null {
  if (!location.startsWith('L:')) return null;
  
  const parts = location.substring(2).split('-');
  if (parts.length !== 4) return null;
  
  const pageNumber = parseInt(parts[0], 10);
  const lineNumber = parseInt(parts[1], 10);
  const wordNumber = parseInt(parts[2], 10);
  const charNumber = parseInt(parts[3], 10);
  
  // Find the page
  const page = book.pages.find(p => p.pageNumber === pageNumber);
  if (!page) return null;
  
  // Get the line (convert from 1-based to 0-based)
  const lineIndex = lineNumber - 1;
  if (lineIndex < 0 || lineIndex >= page.lines.length) return null;
  
  // Get the word (convert from 1-based to 0-based)
  const line = page.lines[lineIndex];
  const words = line.split(/\s+/);
  const wordIndex = wordNumber - 1;
  
  if (wordIndex < 0 || wordIndex >= words.length) return null;
  
  // Get the character (convert from 1-based to 0-based)
  const word = words[wordIndex];
  const charIndex = charNumber - 1;
  
  if (charIndex < 0 || charIndex >= word.length) return null;
  
  return word[charIndex].toLowerCase();
}

/**
 * Encodes a message using the book cipher with keyword shifting
 * @param message Message to encode
 * @param book Parsed book content
 * @param keyword Keyword for shifting
 * @returns Encoded message
 */
export function encodeMessage(message: string, book: ParsedBook, keyword: string): string {
  if (!message || !keyword) return '';
  
  const seed = generateSeedFromKeyword(keyword);
  const tokens = message.split(/(\w+|\s+|[^\w\s]+)/g).filter(t => t);
  
  return tokens.map(token => {
    // Check if the token is a word
    if (/^\w+$/.test(token)) {
      // Try to find the word in the book
      const wordLocation = findWordInBook(book, token, seed);
      
      if (wordLocation) {
        return wordLocation;
      } else {
        // Word not found - encode each letter
        const letterIds = [];
        for (let i = 0; i < token.length; i++) {
          const letterId = findLetterInBook(book, token[i], seed);
          if (letterId) {
            letterIds.push(letterId);
          } else {
            // If letter not found, just use the letter itself
            letterIds.push(token[i].toLowerCase());
          }
        }
        return `[${letterIds.join(' ')}]`;
      }
    }
    
    // Return unchanged if not a word
    return token;
  }).join('');
}

/**
 * Decodes a message that was encoded with the book cipher
 * @param encodedMessage Encoded message
 * @param book Parsed book content
 * @param keyword Keyword used for encoding
 * @returns Decoded message
 */
export function decodeMessage(encodedMessage: string, book: ParsedBook, keyword: string): string {
  if (!encodedMessage || !keyword) return '';
  
  // First, handle letter IDs (format: L:page-line-word-char)
  const letterPattern = /L:\d+-\d+-\d+-\d+/g;
  let processedText = encodedMessage.replace(letterPattern, (match) => {
    const letter = getLetterFromLocation(book, match);
    return letter || match;
  });
  
  // Handle bracketed groups of letter IDs
  const bracketPattern = /\[(.*?)\]/g;
  processedText = processedText.replace(bracketPattern, (match, content) => {
    // Process each letter ID within the brackets
    const letters = content.split(' ').map((item: string) => {
      if (item.startsWith('L:')) {
        const letter = getLetterFromLocation(book, item);
        return letter || item;
      }
      return item.toLowerCase();
    });
    
    // Join the letters to form the word
    return letters.join('');
  });
  
  // Then, handle word IDs (format: page-line-word)
  const wordPattern = /\b(\d+-\d+-\d+)\b/g;
  return processedText.replace(wordPattern, (match) => {
    const word = getWordFromLocation(book, match);
    return word || match;
  });
}
