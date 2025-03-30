/**
 * Character Index Cipher implementation with keyword offset
 * This module provides functions to encode and decode messages using character indices
 * with an additional layer of security through keyword-based offset.
 */

/**
 * Simple text container for character-based indexing
 */
export interface TextSource {
  rawText: string;
}

/**
 * Parse text content into raw text for character-based indexing
 * @param content Raw text content as string
 * @returns Text source with raw text
 */
export function parseTextContent(content: string): TextSource {
  // For character-based indexing, we just need the raw text
  // Normalize whitespace
  const cleanedText = content
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .trim();                        // Trim leading/trailing whitespace
  
  return { rawText: cleanedText };
}

/**
 * Generates a seed value from a keyword
 * @param keyword Keyword to generate seed from
 * @returns Numeric seed value
 */
export function generateSeedFromKeyword(keyword: string): number {
  if (!keyword) return 0;
  
  // Convert keyword to lowercase to ensure case-insensitivity for the key
  const lowercaseKeyword = keyword.toLowerCase();
  
  let seed = 0;
  for (let i = 0; i < lowercaseKeyword.length; i++) {
    seed += lowercaseKeyword.charCodeAt(i);
  }
  return seed;
}

/**
 * Combined Russian (Cyrillic) and Greek alphabet for encoding
 * This provides a larger character set for tuple-based encoding
 */
const COMBINED_ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω';

/**
 * Special character to indicate fallback encoding
 * This character must not be in the COMBINED_ALPHABET
 */
const FALLBACK_INDICATOR = '⁂'; // Triple asterisk symbol, very uncommon

/**
 * Fallback map for characters not found in the source text
 * Each Latin character maps to a unique fallback encoding
 */
const FALLBACK_MAP: Record<string, string> = {};

// Initialize the fallback map for all Latin characters
function initializeFallbackMap() {
  const latinChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  for (let i = 0; i < latinChars.length; i++) {
    const char = latinChars[i];
    // Create a unique fallback encoding for each character
    // Using the fallback indicator followed by a character from the combined alphabet
    FALLBACK_MAP[char] = FALLBACK_INDICATOR + COMBINED_ALPHABET[i % COMBINED_ALPHABET.length];
  }
}

// Initialize the fallback map
initializeFallbackMap();

/**
 * Converts a number to a tuple of characters from the combined alphabet
 * @param num Number to convert
 * @returns Tuple of two characters
 */
function numberToTuple(num: number): string {
  const alphabetLength = COMBINED_ALPHABET.length;
  const first = num % alphabetLength;
  const second = Math.floor(num / alphabetLength) % alphabetLength;
  
  return COMBINED_ALPHABET[first] + COMBINED_ALPHABET[second];
}

/**
 * Converts a tuple of characters back to a number
 * @param tuple Tuple of two characters
 * @returns Original number
 */
function tupleToNumber(tuple: string): number {
  const alphabetLength = COMBINED_ALPHABET.length;
  const first = COMBINED_ALPHABET.indexOf(tuple[0]);
  const second = COMBINED_ALPHABET.indexOf(tuple[1]);
  
  if (first === -1 || second === -1) {
    return -1; // Invalid tuple
  }
  
  return first + (second * alphabetLength);
}

/**
 * Checks if a string is a fallback encoding
 * @param str String to check
 * @returns True if the string is a fallback encoding
 */
function isFallbackEncoding(str: string): boolean {
  return str.startsWith(FALLBACK_INDICATOR);
}

/**
 * Gets the original character from a fallback encoding
 * @param fallbackEncoding Fallback encoding string
 * @returns Original character or null if not a valid fallback
 */
function getCharacterFromFallback(fallbackEncoding: string): string | null {
  if (!isFallbackEncoding(fallbackEncoding)) {
    return null;
  }
  
  // Find the character that maps to this fallback encoding
  for (const [char, encoding] of Object.entries(FALLBACK_MAP)) {
    if (encoding === fallbackEncoding) {
      return char;
    }
  }
  
  return null;
}

/**
 * Encodes a message using character indices with keyword offset
 * @param message Message to encode
 * @param textSource Text source with raw text
 * @param keyword Keyword for offset
 * @returns Encoded message with character tuples
 */
export function encodeMessage(message: string, textSource: TextSource, keyword: string): string {
  if (!message || !keyword || !textSource.rawText) return '';
  
  // Convert keyword to lowercase to ensure case-insensitivity for the key
  const lowercaseKeyword = keyword.toLowerCase();
  
  const seed = generateSeedFromKeyword(lowercaseKeyword);
  const sourceText = textSource.rawText;
  const sourceLength = sourceText.length;
  
  let result = '';
  
  // Track used positions for each character
  const usedPositions: Map<string, Set<number>> = new Map();
  
  // Encode each character
  for (const char of message) {
    // Keep spaces and punctuation as is
    if (char === ' ' || !/[a-zA-Z]/.test(char)) {
      result += char;
      continue;
    }
    
    // Initialize the set of used positions for this character if it doesn't exist
    if (!usedPositions.has(char)) {
      usedPositions.set(char, new Set<number>());
    }
    
    // Get the set of positions already used for this character
    const usedPositionsForChar = usedPositions.get(char)!;
    
    // Find the exact character (case sensitive) in the source text
    let startPos = seed % sourceLength;
    let found = false;
    let foundIndex = -1;
    
    // First try to find the exact character (case sensitive) that hasn't been used before
    for (let i = 0; i < sourceLength; i++) {
      const pos = (startPos + i) % sourceLength;
      if (sourceText[pos] === char && !usedPositionsForChar.has(pos)) {
        foundIndex = pos;
        found = true;
        break;
      }
    }
    
    // If all occurrences have been used or character not found, use the fallback
    if (!found) {
      // Use the fallback encoding for this character
      const fallbackEncoding = FALLBACK_MAP[char];
      if (fallbackEncoding) {
        result += fallbackEncoding;
      } else {
        // If no fallback available, keep the character as is
        result += char;
      }
    } else {
      // Mark this position as used for this character
      usedPositionsForChar.add(foundIndex);
      
      // Convert the index to a tuple of characters
      result += numberToTuple(foundIndex);
    }
  }
  
  return result;
}

/**
 * Decodes a message that was encoded with the character index cipher
 * @param encodedMessage Encoded message with character tuples
 * @param textSource Text source with raw text
 * @param keyword Keyword used for encoding
 * @returns Decoded message
 */
export function decodeMessage(encodedMessage: string, textSource: TextSource, keyword: string): string {
  if (!encodedMessage || !keyword || !textSource.rawText) return '';
  
  // Convert keyword to lowercase to ensure case-insensitivity for the key
  const lowercaseKeyword = keyword.toLowerCase();
  
  const seed = generateSeedFromKeyword(lowercaseKeyword);
  const sourceText = textSource.rawText;
  const sourceLength = sourceText.length;
  
  let result = '';
  let i = 0;
  
  // Process each character in the encoded message
  while (i < encodedMessage.length) {
    const char = encodedMessage[i];
    
    // Keep spaces and punctuation as is
    if (char === ' ' || !/[a-zA-ZА-Яа-яΑ-Ωα-ω⁂]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // Check if this is a fallback encoding
    if (char === FALLBACK_INDICATOR && i + 1 < encodedMessage.length) {
      const fallbackEncoding = encodedMessage.substring(i, i + 2);
      const originalChar = getCharacterFromFallback(fallbackEncoding);
      
      if (originalChar) {
        result += originalChar;
        i += 2; // Move past the fallback encoding
      } else {
        // If not a valid fallback, keep the character as is
        result += char;
        i++;
      }
      continue;
    }
    
    // Check if we have enough characters for a tuple
    if (i + 1 < encodedMessage.length) {
      const tuple = encodedMessage.substring(i, i + 2);
      const index = tupleToNumber(tuple);
      
      if (index >= 0 && index < sourceLength) {
        // Get the exact character at the index (preserving case)
        result += sourceText[index];
        i += 2; // Move past the tuple
      } else {
        // If not a valid tuple, keep the character as is
        result += char;
        i++;
      }
    } else {
      // Not enough characters left for a tuple
      result += char;
      i++;
    }
  }
  
  return result;
}
