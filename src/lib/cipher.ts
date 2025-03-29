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
 * Generates a numeric seed from a keyword
 * @param keyword The keyword to generate a seed from
 * @returns A numeric seed value
 */
export function generateSeedFromKeyword(keyword: string): number {
  // Simple sum of character codes for more predictable results
  return keyword.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

/**
 * Latin and Greek alphabets for encoding
 */
const LATIN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GREEK_ALPHABET = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';

/**
 * Encodes a message using character indices with keyword offset
 * @param message Message to encode
 * @param textSource Text source with raw text
 * @param keyword Keyword for offset
 * @returns Encoded message as a mixture of Greek and Latin letters
 */
export function encodeMessage(message: string, textSource: TextSource, keyword: string): string {
  if (!message || !keyword || !textSource.rawText) return '';
  
  const seed = generateSeedFromKeyword(keyword);
  const sourceText = textSource.rawText;
  const sourceLength = sourceText.length;
  
  // Normalize input text (lowercase only)
  const normalizedInput = message.toLowerCase();
  
  let result = '';
  
  // Encode each character
  for (const char of normalizedInput) {
    if (char === ' ') {
      // Keep spaces as spaces
      result += ' ';
      continue;
    }
    
    // Find the character in the source text (with offset)
    let startPos = seed % sourceLength;
    let found = false;
    let foundIndex = -1;
    
    // Search through the entire source text starting from the offset position
    for (let i = 0; i < sourceLength; i++) {
      const pos = (startPos + i) % sourceLength;
      if (sourceText[pos].toLowerCase() === char.toLowerCase()) {
        foundIndex = pos;
        found = true;
        break;
      }
    }
    
    if (found) {
      // Convert the index to a Greek or Latin letter
      const useGreek = foundIndex % 2 === 0;
      const alphabet = useGreek ? GREEK_ALPHABET : LATIN_ALPHABET;
      const position = foundIndex % alphabet.length;
      
      result += alphabet[position];
    } else {
      // If character not found, use a fallback character
      result += '?';
    }
  }
  
  return result;
}

/**
 * Decodes a message that was encoded with the character index cipher
 * @param encodedMessage Encoded message (mixture of Greek and Latin letters)
 * @param textSource Text source with raw text
 * @param keyword Keyword used for encoding
 * @returns Decoded message
 */
export function decodeMessage(encodedMessage: string, textSource: TextSource, keyword: string): string {
  if (!encodedMessage || !keyword || !textSource.rawText) return '';
  
  const seed = generateSeedFromKeyword(keyword);
  const sourceText = textSource.rawText;
  const sourceLength = sourceText.length;
  
  let result = '';
  
  // Process each character in the encoded message
  for (const char of encodedMessage) {
    if (char === ' ') {
      // Keep spaces as spaces
      result += ' ';
      continue;
    }
    
    if (char === '?') {
      // Handle fallback character
      result += '?';
      continue;
    }
    
    // Determine which alphabet the character belongs to
    const isGreek = GREEK_ALPHABET.includes(char);
    const isLatin = LATIN_ALPHABET.includes(char);
    
    if (!isGreek && !isLatin) {
      // If not a recognized character, keep it unchanged
      result += char;
      continue;
    }
    
    // Find the position in the appropriate alphabet
    const alphabet = isGreek ? GREEK_ALPHABET : LATIN_ALPHABET;
    const position = alphabet.indexOf(char);
    
    // Calculate possible indices in the source text
    const possibleIndices = [];
    for (let i = 0; i < sourceLength; i++) {
      if (i % alphabet.length === position && i % 2 === (isGreek ? 0 : 1)) {
        possibleIndices.push(i);
      }
    }
    
    // Find the correct index based on the seed
    const startPos = seed % sourceLength;
    let closestIndex = -1;
    let minDistance = sourceLength;
    
    for (const index of possibleIndices) {
      // Calculate circular distance from the start position
      const distance = (index >= startPos) 
        ? index - startPos 
        : sourceLength - startPos + index;
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    }
    
    // Get the character at the closest index
    if (closestIndex >= 0 && closestIndex < sourceLength) {
      result += sourceText[closestIndex].toLowerCase();
    } else {
      // Fallback if no valid index found
      result += '?';
    }
  }
  
  return result;
}
