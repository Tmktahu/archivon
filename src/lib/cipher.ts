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
    .replace(/\uFEFF/g, '')         // Remove BOM characters
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
  
  // Using a simple letter-to-number conversion (a=1, b=2, etc.)
  // This would be a common approach in 1904
  let seed = 0;
  for (let i = 0; i < lowercaseKeyword.length; i++) {
    const char = lowercaseKeyword[i];
    // For letters, use their position in alphabet (a=1, b=2, etc.)
    if (char >= 'a' && char <= 'z') {
      seed += (char.charCodeAt(0) - 96); // 'a' is 97 in ASCII, so -96 gives 1
    } else {
      // For non-letters, just use a simple value
      seed += 1;
    }
  }
  
  // Multiply by the length of the keyword for additional complexity
  // This is still a calculation that could be done manually in 1904
  seed *= lowercaseKeyword.length;
  
  return seed;
}

/**
 * Combined Russian (Cyrillic) and Greek alphabet for encoding
 * This provides a larger character set for tuple-based encoding
 */
// const COMBINED_ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω';

/**
 * Checks if a character is part of the combined cipher alphabet (ciphertext)
 * @param char Character to check
 * @returns True if the character is in the combined alphabet
 */
function isCiphertextCharacter(char: string): boolean {
  return COMBINED_ALPHABET.includes(char);
}

/**
 * Checks if a character is plaintext (ASCII)
 * @param char Character to check
 * @returns True if the character is ASCII
 */
function isPlaintextCharacter(char: string): boolean {
  return /^[A-Za-z]$/.test(char);
}

// we want to take the character set above and make a random string of them
// we need to do this for compatibility with the syn_mail system
const COMBINED_ALPHABET = 'ÝôµÈÆìªíÎó¢¶Ú¤ñð£âåéÙùæûçÂÇÿïÐØÞòÜÍÊÄÖõ¿üÏêÓºãä¬ÅàÀÕøþöË¥±ÛÌÑáÔèÁÃßîúÒëÉý';

/**
 * Special character to indicate fallback encoding
 * This character must not be in the COMBINED_ALPHABET
 */
const FALLBACK_INDICATOR = '§'; // Unique fallback indicator, not in COMBINED_ALPHABET

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
    if (char === ' ' || !isPlaintextCharacter(char)) {
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
    
    // If all occurrences have been used or character not found, reset and reuse positions
    if (!found) {
      // Count how many times this character appears in the source text
      let occurrenceCount = 0;
      for (let i = 0; i < sourceLength; i++) {
        if (sourceText[i] === char) {
          occurrenceCount++;
        }
      }

      if (occurrenceCount === 0) {
        // Character does not exist in book at all, use fallback immediately
        const fallbackEncoding = FALLBACK_MAP[char];
        if (fallbackEncoding) {
          result += fallbackEncoding;
        } else {
          result += char;
        }
      } else if (usedPositionsForChar.size >= occurrenceCount) {
        // All occurrences have been used, reset and reuse positions
        usedPositions.set(char, new Set<number>());

        // Try to find the character again with reset positions
        for (let i = 0; i < sourceLength; i++) {
          const pos = (startPos + i) % sourceLength;
          if (sourceText[pos] === char) {
            foundIndex = pos;
            found = true;
            break;
          }
        }

        if (found) {
          usedPositionsForChar.add(foundIndex);
          result += numberToTuple(foundIndex);
        } else {
          // Should not happen, but fallback just in case
          const fallbackEncoding = FALLBACK_MAP[char];
          if (fallbackEncoding) {
            result += fallbackEncoding;
          } else {
            result += char;
          }
        }
      } else {
        // Character exists but not found this pass, use fallback
        const fallbackEncoding = FALLBACK_MAP[char];
        if (fallbackEncoding) {
          result += fallbackEncoding;
        } else {
          result += char;
        }
      }
    } else {
      // Mark this position as used for this character
      usedPositionsForChar.add(foundIndex);
      
      const alphabetLength = COMBINED_ALPHABET.length;
      const maxIndex = alphabetLength * alphabetLength - 1;
      const relativeIndex = (foundIndex - (seed % sourceLength) + sourceLength) % sourceLength;
      if (relativeIndex > maxIndex) {
        const fallbackEncoding = FALLBACK_MAP[char];
        if (fallbackEncoding) {
          result += fallbackEncoding;
        } else {
          result += char;
        }
      } else {
        result += numberToTuple(relativeIndex);
      }
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
  
  // Process each character in the encoded message
  let decoded = '';
  let i = 0;
  while (i < encodedMessage.length) {
    const char1 = encodedMessage[i];
    const char2 = encodedMessage[i + 1];

    // Check if both characters are in the cipher alphabet
    if (
      i + 1 < encodedMessage.length &&
      (char1 === FALLBACK_INDICATOR ||
       (COMBINED_ALPHABET.includes(char1) && COMBINED_ALPHABET.includes(char2)))
    ) {
      const pair = char1 + char2;

      if (pair.startsWith(FALLBACK_INDICATOR)) {
        const originalChar = getCharacterFromFallback(pair);
        decoded += originalChar ? originalChar : pair;
      } else {
        const index = tupleToNumber(pair);
        const startPos = seed % sourceLength;
        const foundIndex = (index + startPos) % sourceLength;
        if (index >= 0 && index < sourceLength) {
          decoded += sourceText[foundIndex];
        } else {
          decoded += pair;
        }
      }
      i += 2;
    } else {
      decoded += char1;
      i += 1;
    }
  }
  result = decoded;
  
  return result;
}