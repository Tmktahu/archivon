<script lang="ts">
  import { onMount } from 'svelte';
  import { useSimpleCipher } from '$lib/models/useSimpleCipher';

  const { normalizeKeyword, createCipherSymbolList, createCipherMap, encrypt, decrypt, copyEncryptionStepsToClipboard, copyDecryptionStepsToClipboard } = useSimpleCipher();

  // State variables
  let keyword = '';
  let inputText = '';
  let encodedText = '';
  let decodedText = '';
  let activeTab = 'encode';

  // Cipher Step Outputs
  let normalizedKeywordOutput = '';
  let baseSymbolListOutput = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  let alteredSymbolListOutput = '';
  let letterAssignmentsOutput = '';
  let finalMappingOutput: any = null;

  const updateCipherSteps = (currentKeyword: string) => {
    normalizedKeywordOutput = currentKeyword ? normalizeKeyword(currentKeyword) : '';
    const symbolList = normalizedKeywordOutput ? createCipherSymbolList(normalizedKeywordOutput) : baseSymbolListOutput.split('');
    alteredSymbolListOutput = symbolList.join('');

    finalMappingOutput = alteredSymbolListOutput ? createCipherMap(symbolList) : null;

    if (finalMappingOutput) {
      // Format letter assignments in a grid format
      const entries = Object.entries(finalMappingOutput);

      // First row: all letters
      const lettersRow = entries.map(([letter]) => letter).join(' ');

      // Second row: horizontal bar with pattern -|-|-|-|
      const horizontalBar = '-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-'; // Pattern of -|-|-|-|

      // Find the maximum number of symbols for any letter
      const maxSymbols = Math.max(...entries.map(([_, symbols]) => (Array.isArray(symbols) ? symbols.length : 0)));

      // Create rows for symbols
      const symbolRows = [];
      for (let i = 0; i < maxSymbols; i++) {
        const row = entries
          .map(([_, symbols]) => {
            if (Array.isArray(symbols) && symbols[i]) {
              return symbols[i];
            }
            return ' '; // Empty space if no symbol at this position
          })
          .join(' ');
        symbolRows.push(row);
      }

      // Combine all rows
      letterAssignmentsOutput = [lettersRow, horizontalBar, ...symbolRows].join('\n');
    } else {
      letterAssignmentsOutput = '';
    }
  };

  updateCipherSteps(''); // Initialize with empty keyword

  // Function to get occult symbol for a digit (remains same)
  function getOccultSymbolForDigit(digit: string) {
    const symbols = [
      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1"/><line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="0.5"/><line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><path d="M6,12 L18,12 L12,5 Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M6,12 L18,12 L12,19 Z" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><path d="M12,4 L20,12 L12,20 L4,12 Z" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="0.5"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><path d="M8,8 L16,8 L16,16 L8,16 Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><path d="M12,5 L17,12 L12,19 L7,12 Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1"/><line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><path d="M12,4 L16,8 L16,16 L8,16 L8,8 Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
      `<svg viewBox="0 0 24 24"><path d="M8,8 L16,8 L16,16 L8,16 Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M6,6 L18,6 L18,18 L6,18 Z" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="0.5"/></svg>`,
    ];
    return symbols[parseInt(digit)];
  }

  // Encode message function
  function encodeMessage() {
    if (!keyword || !inputText) return;
    encodedText = encrypt(inputText, keyword);
  }

  // Function to copy cipher steps to clipboard
  async function handleCopySteps() {
    if (!keyword || !inputText || !encodedText) return;

    try {
      await copyEncryptionStepsToClipboard(inputText, keyword, encodedText);
    } catch (error) {
      // Handle the error properly with type checking
      if (error instanceof Error) {
        console.error('Error copying steps:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  // Function to copy decryption steps to clipboard
  async function handleCopyDecryptionSteps() {
    if (!keyword || !encodedText || !decodedText) return;

    try {
      await copyDecryptionStepsToClipboard(encodedText, keyword, decodedText);
    } catch (error) {
      // Handle the error properly with type checking
      if (error instanceof Error) {
        console.error('Error copying decryption steps:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  // Decode message function
  function decodeMessage() {
    if (!keyword || !encodedText) return;
    decodedText = decrypt(encodedText, keyword);
  }

  function setActiveTab(tab: 'encode' | 'decode') {
    activeTab = tab;
  }

  onMount(() => {
    // Any initialization code can go here
  });
</script>

<svelte:head>
  <title>Archivon | Cipher Utility</title>
  <meta name="description" content="Keyword-Based Homophonic Substitution Cipher Utility" />
  <link
    href="https://fonts.googleapis.com/css2?family=Rye&family=Special+Elite&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Fredericka+the+Great&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
  <link rel="apple-touch-icon" href="/favicon-96x96.png" />
</svelte:head>

<main class="min-h-screen bg-zinc-900 text-silver-400 relative">
  <div class="absolute inset-0 bg-zinc-900 opacity-90 z-0"></div>
  <div class="absolute inset-0 flex items-center justify-center z-0 opacity-5">
    <div class="w-[800px] h-[800px] logo-background"></div>
  </div>

  <div class="relative z-10 border-b-4 border-double border-silver-700/70">
    <header class="container mx-auto px-4 py-8 text-center">
      <div class="relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="occult-background">
            <div class="occult-symbol-outer"></div>
            <div class="occult-symbol-inner"></div>
          </div>
        </div>
        <div class="wanted-poster">
          <h1 class="text-4xl md:text-6xl font-bold mb-2 font-display tracking-widest text-brass-light relative z-10 drop-shadow-sm western-text"> CIPHER UTILITY </h1>
          <div class="flex justify-center items-center gap-4 mt-4">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-silver-500/70"></div>
            <p class="text-sm uppercase tracking-widest font-semibold text-silver-400/80">Order of Records</p>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-silver-500/70"></div>
          </div>
        </div>
      </div>
    </header>
  </div>

  <div class="container mx-auto px-4 py-8 relative z-10">
    <section class="mb-12 max-w-5xl mx-auto relative">
      <div class="border-4 border-double border-silver-700 rounded-none shadow-xl overflow-hidden wanted-poster-container relative z-10 bg-zinc-800/30">
        <div class="p-6 border-b-2 border-silver-700">
          <h2 class="text-2xl font-bold text-center font-display tracking-wider text-silver-400 drop-shadow-sm"> KEYWORD CIPHER UTILITY </h2>
          <div class="flex justify-center items-center mt-2">
            <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/80"></div>
            <div class="flex items-center gap-4 mx-4">
              <div class="occult-icon-wrapper">
                <div class="occult-geometry eye-geometry"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c9b17c"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="opacity-70 relative z-10"
                  style="transform: rotate(90deg);"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div class="occult-icon-wrapper">
                <div class="occult-geometry pen-geometry"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c9b17c"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="opacity-70 relative z-10"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
              </div>
              <div class="occult-icon-wrapper">
                <div class="occult-geometry lock-geometry"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c9b17c"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="opacity-70 relative z-10"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
            <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/80"></div>
          </div>

          <div class="p-4 md:p-6 bg-transparent">
            <div class="grid grid-cols-1 md:grid-cols-11 gap-1 mb-2 items-center">
              <div class="col-span-1 md:col-span-5">
                <label for="keyword" class="block text-silver-300 mb-1 font-semibold uppercase text-sm tracking-wider">Cipher Key Phrase</label>
                <input
                  type="text"
                  id="keyword"
                  bind:value={keyword}
                  on:input={(e) => {
                    const inputElement = e.target as HTMLInputElement;
                    keyword = inputElement?.value || '';
                    updateCipherSteps(keyword);
                  }}
                  class="w-full bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-2 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm h-[40px]"
                />
              </div>
              <div class="hidden md:flex justify-center items-center md:col-span-1 px-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-silver-500"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              <div class="col-span-1 md:col-span-5">
                <label for="normalized-keyword" class="block text-silver-300 mb-1 font-semibold uppercase text-sm tracking-wider">Normalized Keyword</label>
                <textarea
                  id="normalized-keyword"
                  readonly
                  class="w-full h-[40px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-1 text-silver-300 font-mono text-sm resize-none"
                  >{normalizedKeywordOutput}</textarea
                >
              </div>
            </div>

            <div class="mb-2">
              <div class="grid grid-cols-11 gap-1 mb-2 items-center">
                <div class="col-span-5 mb-1">
                  <label for="base-symbols" class="block text-md font-semibold text-silver-300 mb-0">Base Symbols</label>
                  <textarea
                    id="base-symbols"
                    readonly
                    class="w-full h-[80px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-1 text-silver-300 font-mono text-sm resize-none"
                    >{baseSymbolListOutput}</textarea
                  >
                </div>

                <div class="flex justify-center items-center col-span-1 px-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-silver-500"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>

                <div class="col-span-5 mb-1">
                  <label for="altered-symbols" class="block text-md font-semibold text-silver-300 mb-0">Altered Symbols</label>
                  <textarea
                    id="altered-symbols"
                    readonly
                    class="w-full h-[80px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-1 text-silver-300 font-mono text-sm resize-none"
                    >{alteredSymbolListOutput}</textarea
                  >
                </div>
              </div>

              <div class="mb-1">
                <div class="mb-1">
                  <label for="letter-assignments" class="block text-md font-semibold text-silver-300 mb-0 text-center">Letter Assignments</label>
                  <textarea
                    id="letter-assignments"
                    readonly
                    class="w-full h-[150px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-1 text-silver-300 text-sm resize-none tracking-widest font-['Courier_New',_monospace] leading-none text-center"
                    >{letterAssignmentsOutput}</textarea
                  >
                </div>
              </div>

              <!-- Tabs for Encode/Decode -->
              <div class="mb-6 border-b-2 border-zinc-600">
                <div class="flex">
                  <button
                    class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${
                      activeTab === 'encode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'
                    }`}
                    on:click={() => setActiveTab('encode')}
                  >
                    <span class="flex items-center"> Encode </span>
                  </button>
                  <button
                    class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${
                      activeTab === 'decode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'
                    }`}
                    on:click={() => setActiveTab('decode')}
                  >
                    <span class="flex items-center"> Decode </span>
                  </button>
                </div>
              </div>

              <!-- Encode/Decode Content -->
              {#if activeTab === 'encode'}
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label for="input-text" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Content to Encode</label>
                      <textarea
                        id="input-text"
                        bind:value={inputText}
                        placeholder="Enter the message you wish to encode..."
                        class="w-full h-[200px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-3 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label for="encoded-text" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Encoded Output</label>
                      <textarea
                        id="encoded-text"
                        bind:value={encodedText}
                        readonly
                        class="w-full h-[200px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-3 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm"
                      ></textarea>
                    </div>
                  </div>
                  <div class="flex flex-col items-center mt-4 w-full">
                    <div class="flex gap-4">
                      <button
                        on:click={encodeMessage}
                        disabled={!keyword || !inputText}
                        class="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Encode Message
                      </button>

                      <button
                        on:click={handleCopySteps}
                        disabled={!keyword || !inputText || !encodedText}
                        class="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="mr-2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy Steps
                      </button>
                    </div>
                  </div>
                </div>
              {:else}
                <!-- Decode Section -->
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label for="encoded-input" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Encoded Message</label>
                      <textarea
                        id="encoded-input"
                        bind:value={encodedText}
                        placeholder="Enter the encoded message you wish to decode..."
                        class="w-full h-[200px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-3 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label for="decoded-text" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Decoded Output</label>
                      <textarea
                        id="decoded-text"
                        bind:value={decodedText}
                        readonly
                        class="w-full h-[200px] bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-3 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm"
                      ></textarea>
                    </div>
                  </div>
                  <div class="flex flex-col items-center mt-4 w-full">
                    <div class="flex gap-4">
                      <button
                        on:click={decodeMessage}
                        disabled={!keyword || !encodedText}
                        class="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Decode Message
                      </button>

                      <button
                        on:click={handleCopyDecryptionSteps}
                        disabled={!keyword || !encodedText || !decodedText}
                        class="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="mr-2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy Steps
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div></section
    >
  </div>

  <footer class="bg-zinc-800 py-8 text-silver-400/80 border-t-4 border-double border-silver-700 relative z-10">
    <div class="container mx-auto px-4 text-center">
      <div class="flex justify-center items-center mb-4">
        <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/60"></div>
        <div class="flex items-center gap-4 mx-4">
          <div class="occult-icon-wrapper">
            <div class="occult-geometry moon-geometry"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9b17c"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="opacity-70 relative z-10"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </div>
          <div class="occult-icon-wrapper">
            <div class="occult-geometry star-geometry"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9b17c"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="opacity-70 relative z-10"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div class="occult-icon-wrapper">
            <div class="occult-geometry sun-geometry"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9b17c"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="opacity-70 relative z-10"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>
        </div>
        <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/60"></div>
        <div class="typewriter">
          <p class="mb-2 text-xs text-silver-400/70">For Knowledge. For Protection. For Understanding.</p>
        </div>
      </div>
    </div></footer
  >
</main>
