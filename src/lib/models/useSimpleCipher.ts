export const useSimpleCipher = () => {
  // Define the pool of symbols for the cipher (A-Z, 0-9, a-z)
  const symbolPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

  // Define letter frequencies in English to assign more symbols to frequent letters
  const letterFrequencies = {
    A: 5,
    B: 1,
    C: 2,
    D: 2,
    E: 7,
    F: 1,
    G: 1,
    H: 3,
    I: 4,
    J: 1,
    K: 1,
    L: 2,
    M: 1,
    N: 4,
    O: 5,
    P: 1,
    Q: 1,
    R: 3,
    S: 4,
    T: 6,
    U: 1,
    V: 1,
    W: 1,
    X: 1,
    Y: 1,
    Z: 1,
  };

  /**
   * Normalizes the keyword by removing duplicate characters, preserving order.
   * @param keyword - The keyword to normalize.
   * @returns The normalized keyword.
   */
  const normalizeKeyword = (keyword: string) => {
    const seenChars = new Set(); // To keep track of characters already added
    let normalizedKeyword = '';
    for (const char of keyword) {
      if (!seenChars.has(char)) {
        seenChars.add(char); // Add character to set of seen characters
        normalizedKeyword += char; // Append to normalized keyword
      }
    }
    return normalizedKeyword.replace(/\s/g, ''); // Remove spaces from normalized keyword
  };

  /**
   * Creates a deterministic shuffled list of cipher symbols based on the normalized keyword.
   * It starts with the keyword and appends the remaining symbols from the pool.
   * @param normalizedKeyword - The normalized keyword.
   * @returns An array of cipher symbols.
   */
  const createCipherSymbolList = (normalizedKeyword: string) => {
    let cipherSymbols = normalizedKeyword; // Start with normalized keyword
    for (const char of symbolPool) {
      if (!cipherSymbols.includes(char)) {
        cipherSymbols += char; // Append symbols from the pool that are not in the keyword
      }
    }
    return cipherSymbols.split(''); // Convert string to array of characters
  };

  /**
   * Creates the cipher map using a dealing method, assigning symbols to letters based on frequency.
   * @param cipherSymbolList - The shuffled list of cipher symbols.
   * @returns A map where keys are plaintext letters (A-Z) and values are arrays of cipher symbols.
   */
  const createCipherMap = (cipherSymbolList: string[]) => {
    const cipherMap: { [key: string]: string[] } = {};
    const letterOrder = Object.keys(letterFrequencies); // Order of letters to deal symbols
    const letterCounts = { ...letterFrequencies }; // Track remaining symbols per letter
    let symbolIndex = 0;

    for (symbolIndex = 0; symbolIndex < cipherSymbolList.length; ) {
      let symbolAssignedInIteration = false; // Flag to track if any symbol was assigned

      for (const letter of letterOrder) {
        if (symbolIndex < cipherSymbolList.length && letterCounts[letter as keyof typeof letterFrequencies] > 0) {
          cipherMap[letter] = cipherMap[letter] || [];
          const symbolsForLetter = cipherMap[letter];
          symbolsForLetter.push(cipherSymbolList[symbolIndex++]);
          letterCounts[letter as keyof typeof letterFrequencies]--;
          symbolAssignedInIteration = true; // Symbol was assigned in this iteration
        }
      }

      if (!symbolAssignedInIteration) {
        break; // Break out of outer loop if no symbol was assigned in inner loop
      }
    }
    return cipherMap;
  };

  /**
   * Encrypts a plaintext message using the keyword-based homophonic substitution cipher.
   * @param plainText - The message to encrypt.
   * @param keyword - The keyword for encryption.
   * @returns The encrypted ciphertext.
   */
  const encrypt = (plainText: string, keyword: string) => {
    const normalizedKeyword = normalizeKeyword(keyword);
    const cipherSymbolList = createCipherSymbolList(normalizedKeyword);
    const cipherMap = createCipherMap(cipherSymbolList);
    let cipherText = '';
    for (const char of plainText) {
      // Removed .toUpperCase() to maintain case sensitivity
      if (cipherMap[char.toUpperCase()]) {
        // Changed to .toUpperCase() for cipherMap lookup
        const symbols = cipherMap[char.toUpperCase()];
        cipherText += symbols[Math.floor(Math.random() * symbols.length)]; // Randomly pick one of the symbols for encryption
      } else {
        cipherText += char; // Keep non-alphabetic characters as is
      }
    }
    return cipherText;
  };

  /**
   * Decrypts a ciphertext message using the keyword-based homophonic substitution cipher.
   * @param cipherText - The message to decrypt.
   * @param keyword - The keyword for decryption (must be the same as used for encryption).
   * @returns The decrypted plaintext in lowercase.
   */
  const decrypt = (cipherText: string, keyword: string) => {
    const normalizedKeyword = normalizeKeyword(keyword);
    const cipherSymbolList = createCipherSymbolList(normalizedKeyword);
    const cipherMap = createCipherMap(cipherSymbolList);
    const reverseCipherMap: { [key: string]: string } = {}; // To reverse lookup symbols to letters
    for (const letter in cipherMap) {
      cipherMap[letter].forEach((symbol) => {
        reverseCipherMap[symbol] = letter; // Create reverse map for decryption
      });
    }

    let plainText = '';
    for (const char of cipherText) {
      if (reverseCipherMap[char]) {
        plainText += reverseCipherMap[char]; // Substitute cipher symbol with corresponding letter
      } else {
        plainText += char; // Keep non-cipher characters as is
      }
    }
    return plainText.toLowerCase(); // Return decrypted text in lowercase
  };

  /**
   * Copies all the steps of the cipher process to the clipboard in a formatted way.
   * @param plainText - The original message to encrypt.
   * @param keyword - The keyword for encryption.
   * @returns A promise that resolves when the text has been copied to the clipboard.
   */
  const copyEncryptionStepsToClipboard = async (plainText: string, keyword: string, cipherText: string): Promise<void> => {
    if (!plainText || !keyword) {
      throw new Error('Both plainText and keyword are required');
    }

    const normalizedKeyword = normalizeKeyword(keyword);
    const cipherSymbolList = createCipherSymbolList(normalizedKeyword);
    const cipherMap = createCipherMap(cipherSymbolList);

    // Format the steps in a readable way
    let formattedSteps = '';

    // Step 1: Keyword
    formattedSteps += `Original phrase: ${keyword}\n`;
    formattedSteps += `Normalized phrase: ${normalizedKeyword}\n\n`;

    // Step 2: Symbol List
    formattedSteps += `Base Cipher Symbol List: ${symbolPool}\n`;
    formattedSteps += `Rearranged Cipher Symbol List: ${cipherSymbolList.join('')}\n\n`;

    // Step 3: Letter-to-Symbol Mapping
    // Format the letter assignments in a grid
    const entries = Object.entries(cipherMap);

    // First row: all letters
    const lettersRow = entries.map(([letter]) => letter).join(' ');
    formattedSteps += lettersRow + '\n';

    // Second row: horizontal bar
    const horizontalBar = '-'.repeat(lettersRow.length) + '\n';
    formattedSteps += horizontalBar;

    // Find the maximum number of symbols for any letter
    const maxSymbols = Math.max(...entries.map(([_, symbols]) => (Array.isArray(symbols) ? symbols.length : 0)));

    // Create rows for symbols
    for (let i = 0; i < maxSymbols; i++) {
      const row = entries
        .map(([_, symbols]) => {
          if (Array.isArray(symbols) && symbols[i]) {
            return symbols[i];
          }
          return ' '; // Empty space if no symbol at this position
        })
        .join(' ');
      formattedSteps += row + '\n';
    }
    formattedSteps += '\n';

    // Step 4: Encryption Process
    formattedSteps += `Plaintext\n`;
    formattedSteps += `${plainText}\n\n`;

    formattedSteps += `Ciphertext\n`;
    formattedSteps += `${cipherText}`;

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(formattedSteps);
      console.log('Cipher steps copied to clipboard');
    } catch (err) {
      console.error('Failed to copy cipher steps to clipboard:', err);
      throw new Error('Failed to copy to clipboard: ' + err);
    }
  };

  /**
   * Copies all the steps of the decryption process to the clipboard in a formatted way.
   * @param cipherText - The encrypted message to decrypt.
   * @param keyword - The keyword for decryption.
   * @param plainText - The decrypted message.
   * @returns A promise that resolves when the text has been copied to the clipboard.
   */
  const copyDecryptionStepsToClipboard = async (cipherText: string, keyword: string, plainText: string): Promise<void> => {
    if (!cipherText || !keyword) {
      throw new Error('Both cipherText and keyword are required');
    }

    const normalizedKeyword = normalizeKeyword(keyword);
    const cipherSymbolList = createCipherSymbolList(normalizedKeyword);
    const cipherMap = createCipherMap(cipherSymbolList);

    // Create reverse cipher map for decryption
    const reverseCipherMap: { [key: string]: string } = {};
    for (const letter in cipherMap) {
      cipherMap[letter].forEach((symbol) => {
        reverseCipherMap[symbol] = letter;
      });
    }

    // Format the steps in a readable way
    let formattedSteps = '';

    // Step 1: Keyword
    formattedSteps += `Original phrase: ${keyword}\n`;
    formattedSteps += `Normalized phrase: ${normalizedKeyword}\n\n`;

    // Step 2: Symbol List
    formattedSteps += `Base Cipher Symbol List: ${symbolPool}\n`;
    formattedSteps += `Rearranged Cipher Symbol List: ${cipherSymbolList.join('')}\n\n`;

    // Step 3: Letter-to-Symbol Mapping
    // Format the letter assignments in a grid, just like in encryption
    const entries = Object.entries(cipherMap);

    // First row: all letters
    const lettersRow = entries.map(([letter]) => letter).join(' ');
    formattedSteps += lettersRow + '\n';

    // Second row: horizontal bar
    const horizontalBar = '-'.repeat(lettersRow.length) + '\n';
    formattedSteps += horizontalBar;

    // Find the maximum number of symbols for any letter
    const maxSymbols = Math.max(...entries.map(([_, symbols]) => (Array.isArray(symbols) ? symbols.length : 0)));

    // Create rows for symbols
    for (let i = 0; i < maxSymbols; i++) {
      const row = entries
        .map(([_, symbols]) => {
          if (Array.isArray(symbols) && symbols[i]) {
            return symbols[i];
          }
          return ' '; // Empty space if no symbol at this position
        })
        .join(' ');
      formattedSteps += row + '\n';
    }
    formattedSteps += '\n';

    // Step 4: Decryption Process
    formattedSteps += `Ciphertext\n`;
    formattedSteps += `${cipherText}\n\n`;

    formattedSteps += `Plaintext\n`;
    formattedSteps += `${plainText}`;

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(formattedSteps);
      console.log('Decryption steps copied to clipboard');
    } catch (err) {
      console.error('Failed to copy decryption steps to clipboard:', err);
      throw new Error('Failed to copy to clipboard: ' + err);
    }
  };

  return {
    normalizeKeyword,
    createCipherSymbolList,
    createCipherMap,
    encrypt,
    decrypt,
    copyEncryptionStepsToClipboard,
    copyDecryptionStepsToClipboard,
  };
};
