<script lang="ts">
  // @ts-nocheck - Disabling TypeScript checking for this file as requested
  import { onMount } from 'svelte';
  import * as cipher from '$lib/cipher';
  import { AVAILABLE_BOOKS } from '$lib/models/constants';

  // State variables
  let selectedBook = '';
  let keyword = '';
  let inputText = '';
  let encodedText = '';
  let decodedText = '';
  let activeTab = 'encode';
  let isLoading = false;
  let parsedBook = null;
  
  // Custom dropdown state
  let isDropdownOpen = false;
  let selectedBookName = '';
  
  // Computed values for occult visualization
  $: keywordSeed = keyword ? cipher.generateSeedFromKeyword(keyword) : 0;
  $: keywordLength = keyword ? keyword.length : 0;
  $: keywordHue = keywordSeed % 360; // Use the seed to determine a color hue
  $: keywordBrightness = Math.min(100, 40 + (keywordSeed % 60)); // Brightness based on seed
  
  // Function to get occult symbol for a digit
  function getOccultSymbolForDigit(digit) {
    // Each digit gets a unique SVG path representing an occult symbol
    const symbols = [
      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`, // 0
      `<svg viewBox="0 0 24 24"><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1"/><line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="0.5"/><line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" stroke-width="0.5"/></svg>`, // 1
      `<svg viewBox="0 0 24 24"><path d="M6,12 L18,12 L12,5 Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M6,12 L18,12 L12,19 Z" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`, // 2
      `<svg viewBox="0 0 24 24"><path d="M12,4 L20,12 L12,20 L4,12 Z" fill="none" stroke="currentColor" stroke-width="1"/></svg>`, // 3
      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="0.5"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="0.5"/></svg>`, // 4
      `<svg viewBox="0 0 24 24"><path d="M8,8 L16,8 L16,16 L8,16 Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`, // 5
      `<svg viewBox="0 0 24 24"><path d="M12,5 L17,12 L12,19 L7,12 Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`, // 6
      `<svg viewBox="0 0 24 24"><line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1"/><line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`, // 7
      `<svg viewBox="0 0 24 24"><path d="M12,4 L16,8 L16,16 L8,16 L8,8 Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`, // 8
      `<svg viewBox="0 0 24 24"><path d="M8,8 L16,8 L16,16 L8,16 Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M6,6 L18,6 L18,18 L6,18 Z" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="0.5"/></svg>` // 9
    ];
    return symbols[parseInt(digit)];
  }
  
  // Toggle dropdown
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }
  
  // Close dropdown if clicked outside
  function handleClickOutside(event) {
    const dropdown = document.getElementById('custom-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen = false;
    }
  }
  
  // Select a book
  function selectBook(book) {
    selectedBook = book.id;
    selectedBookName = book.name;
    isDropdownOpen = false;
    
    // Add has-value class to the dropdown button when it has a value
    const dropdownButton = document.querySelector('.custom-select');
    if (dropdownButton) {
      dropdownButton.classList.add('has-value');
    }
  }

  // Load book content when book selection changes
  async function loadBookContent() {
    if (!selectedBook) return;

    isLoading = true;

    try {
      const book = AVAILABLE_BOOKS.find(b => b.id === selectedBook);
      if (!book) throw new Error('Book not found');

      const response = await fetch(`/books/${book.filename}`);
      if (!response.ok) throw new Error('Failed to load book content');

      const content = await response.text();
      parsedBook = cipher.parseTextContent(content);
    } catch (error) {
      console.error('Error loading book:', error);
      alert('Failed to load book content. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  // Watch for changes to selectedBook
  $: if (selectedBook) {
    loadBookContent();
  }

  // Encode message
  function encodeMessage() {
    if (!parsedBook || !keyword || !inputText) return;

    try {
      encodedText = cipher.encodeMessage(inputText, parsedBook, keyword);
    } catch (error) {
      console.error('Error encoding message:', error);
      alert('Failed to encode message. Please try again.');
    }
  }

  // Decode message
  function decodeMessage() {
    if (!parsedBook || !keyword || !encodedText) return;

    try {
      decodedText = cipher.decodeMessage(encodedText, parsedBook, keyword);
    } catch (error) {
      console.error('Error decoding message:', error);
      alert('Failed to decode message. Please try again.');
    }
  }

  function setActiveTab(tab) {
    activeTab = tab;
  }

  onMount(() => {
    // Add click event listener to close dropdown when clicking outside
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<svelte:head>
  <title>Archivon | Cipher Utility</title>
  <meta name="description" content="A utility for encoding and decoding messages with the Archivon book cipher" />
  <link href="https://fonts.googleapis.com/css2?family=Rye&family=Special+Elite&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Fredericka+the+Great&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen bg-zinc-900 text-zinc-300 font-serif relative">
  <!-- Paper texture background with subtle warm tone -->
  <div class="absolute inset-0 bg-zinc-900 opacity-90 z-0 paper-texture"></div>

  <!-- Pentagram background element -->
  <div class="absolute inset-0 flex items-center justify-center z-0 opacity-5">
    <div class="w-[800px] h-[800px] pentagram"></div>
  </div>

  <!-- Header with Wild West styling -->
  <div class="relative z-10 border-b-4 border-double border-silver-700/70">
    <header class="container mx-auto px-4 py-8 text-center">
      <div class="relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- Replacing concentric circles with occult symbols -->
          <div class="occult-background">
            <div class="occult-symbol-outer"></div>
            <div class="occult-symbol-inner"></div>
          </div>
        </div>

        <div class="wanted-poster">
          <h1 class="text-4xl md:text-6xl font-bold mb-2 font-display tracking-widest text-brass-light relative z-10 drop-shadow-sm western-text">
            ARCHIVON
          </h1>
          <div class="flex justify-center items-center gap-4 mt-4">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-silver-500/70"></div>
            <p class="text-sm uppercase tracking-widest font-semibold text-silver-400/80">Order of Records</p>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-silver-500/70"></div>
          </div>
        </div>

        <div class="mt-4 ooc-note">
          <p class="text-sm text-silver-400/90 italic px-4 py-2 bg-zinc-800/80 border border-silver-700/50 max-w-2xl mx-auto">
            <span class="font-semibold">Out-of-Character Note:</span> This is a utility to help you encode and decode messages using the book cipher. Using this tool does not mean your character knows how to work with the cipher - it simply makes the process easier than doing it manually.
          </p>
        </div>
      </div>
    </header>
  </div>

  <!-- Main Content -->
  <div class="container mx-auto px-4 py-8 relative z-10">
    <!-- Cipher Tool Section -->
    <section class="mb-12 max-w-5xl mx-auto">
      <div class="bg-zinc-800 border-4 border-double border-silver-700 rounded-none shadow-xl overflow-hidden wanted-poster-container">
        <div class="p-6 border-b-2 border-silver-700 bg-zinc-800/80">
          <h2 class="text-2xl font-bold text-center font-display tracking-wider text-silver-400 drop-shadow-sm">CIPHER UTILITY</h2>
          <div class="flex justify-center items-center mt-2">
            <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/80"></div>
            <div class="flex items-center gap-4 mx-4">
              <div class="occult-symbol-eye"></div>
              <div class="occult-symbol-small"></div>
              <div class="occult-symbol-cipher"></div>
            </div>
            <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/80"></div>
          </div>

          <!-- Book and Keyword Selection -->
          <div class="p-6 bg-zinc-800/90">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label for="book-select" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Select Source Text</label>
                
                <!-- Custom dropdown -->
                <div id="custom-dropdown" class="relative">
                  <button 
                    type="button"
                    class="w-full bg-zinc-900/80 text-silver-300/80 placeholder-text-color border-2 border-silver-700 rounded-none px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm h-[50px] text-left custom-select"
                    on:click={toggleDropdown}
                    style="font-family: 'Special Elite', monospace; font-weight: 400; letter-spacing: 0.5px;"
                  >
                    {selectedBookName || 'Choose a source text...'}
                  </button>
                  
                  {#if isDropdownOpen}
                    <div class="absolute z-10 w-full mt-1 bg-zinc-800 border-2 border-silver-700 max-h-60 overflow-auto custom-dropdown-menu">
                      {#each AVAILABLE_BOOKS as book}
                        <button 
                          type="button"
                          class="w-full text-left px-4 py-2 cursor-pointer hover:bg-brass-bg hover:text-brass-light focus:bg-brass-bg focus:text-brass-light"
                          on:click={() => selectBook(book)}
                          on:keydown={(e) => e.key === 'Enter' && selectBook(book)}
                        >
                          {book.name}
                        </button>
                      {/each}
                    </div>
                  {/if}
                </div>
                
                <!-- Hidden select for form submission if needed -->
                <select id="book-select" bind:value={selectedBook} class="hidden">
                  <option value="" disabled>Choose a source text...</option>
                  {#each AVAILABLE_BOOKS as book}
                    <option value={book.id}>{book.name}</option>
                  {/each}
                </select>
                
                {#if isLoading}
                  <p class="mt-2 text-silver-400/80 italic text-sm">Loading text from archives...</p>
                {/if}
                {#if parsedBook}
                  <p class="mt-2 text-silver-400/80 text-sm">
                    <span class="font-semibold text-silver-300">Source text loaded</span> and ready for encoding.
                  </p>
                {/if}
                {#if selectedBook}
                  {#if !isLoading}
                    {#if parsedBook}
                      <p class="mt-2 text-silver-400/80 text-sm">
                        <span class="font-semibold text-silver-300">Author:</span> {AVAILABLE_BOOKS.find(b => b.id === selectedBook)?.author}
                      </p>
                      {#if AVAILABLE_BOOKS.find(b => b.id === selectedBook)?.description}
                        <p class="mt-2 text-silver-400/80 text-sm italic">
                          {AVAILABLE_BOOKS.find(b => b.id === selectedBook)?.description}
                        </p>
                      {/if}
                    {/if}
                  {/if}
                {/if}
              </div>
              <div>
                <label for="keyword" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Cipher Key</label>
                <input 
                  type="text" 
                  id="keyword" 
                  bind:value={keyword}
                  placeholder="Enter your cipher key..."
                  class="w-full bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-3 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm h-[50px]"
                />
                {#if keyword}
                  <div class="mt-2">
                    <!-- Occult symbols representing the numeric value -->
                    <div class="mb-2">
                      <div class="grid grid-cols-5 w-full gap-1">
                        {#each String(keywordSeed).padStart(5, '0').split('') as digit, i}
                          <div class="occult-rune aspect-square flex items-center justify-center"
                               style="--rune-color: hsla({keywordHue + i * 30}, 70%, {keywordBrightness}%, 0.7); --rune-delay: {i * 0.2}s; --rune-rotation: {(parseInt(digit) * 36) % 360}deg;">
                            <div class="rune-svg-container" style="transform: rotate(var(--rune-rotation));">
                              {@html getOccultSymbolForDigit(digit)}
                            </div>
                          </div>
                        {/each}
                      </div>
                      <div class="mt-1 h-[3px] bg-gradient-to-r from-transparent via-[hsla({keywordHue},70%,{keywordBrightness}%,0.5)] to-transparent"></div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Tabs for Encode/Decode -->
            <div class="mb-6 border-b-2 border-silver-700/30">
              <div class="flex">
                <button 
                  class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'encode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'}`}
                  on:click={() => setActiveTab('encode')}
                >
                  <span class="flex items-center">
                    Encode
                  </span>
                </button>
                <button 
                  class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'decode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'}`}
                  on:click={() => setActiveTab('decode')}
                >
                  <span class="flex items-center">
                    Decode
                  </span>
                </button>
              </div>
            </div>

            <!-- Encode/Decode Content -->
            {#if activeTab === 'encode'}
              <div>
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
                <div class="flex justify-center mt-4 w-full">
                  <button 
                    on:click={encodeMessage} 
                    disabled={!parsedBook || !keyword || !inputText}
                    class="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Encode Message
                  </button>
                </div>
              </div>
            {:else}
              <!-- Decode Section -->
              <div>
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
                <div class="flex justify-center mt-4 w-full">
                  <button 
                    on:click={decodeMessage} 
                    disabled={!parsedBook || !keyword || !encodedText}
                    class="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Decode Message
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Footer -->
  <footer class="bg-zinc-800 py-8 text-silver-400/80 border-t-4 border-double border-silver-700 relative z-10">
    <div class="container mx-auto px-4 text-center">
      <!-- Decorative element with multiple occult icons -->
      <div class="flex justify-center items-center mb-4">
        <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/60"></div>
        <div class="flex items-center gap-4 mx-4">
          <div class="occult-symbol-moon"></div>
          <div class="occult-symbol-small"></div>
          <div class="occult-symbol-sun"></div>
        </div>
        <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/60"></div>
      </div>
      
      <p class="mb-2 text-xs typewriter text-silver-400/70">For members of the Order only. Unauthorized access is forbidden.</p>
      <p class="text-xs typewriter text-silver-400/70">Use this utility to encode sensitive information before sending it to the Order.</p>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    background-color: rgb(24, 24, 27); /* zinc-900 */
    font-family: 'Special Elite', serif;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a58e77' fill-opacity='0.05' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }

  .font-display {
    font-family: 'Rye', serif;
  }

  .typewriter {
    font-family: 'Special Elite', monospace;
  }

  /* Color variables */
  :root {
    /* Silver colors */
    --color-silver-300: rgb(212, 212, 216);
    --color-silver-400: rgb(161, 161, 170);
    --color-silver-500: rgb(113, 113, 122);
    --color-silver-600: rgb(82, 82, 91);
    --color-silver-700: rgb(63, 63, 70);

    /* Paper colors */
    --color-paper-light: rgb(250, 244, 234);
    --color-paper-mid: rgb(227, 214, 196);
    --color-paper-dark: rgb(191, 176, 154);
    --color-paper-burnt: rgb(165, 142, 119);
    --color-paper-edge: rgb(137, 108, 78);

    /* Antique brass/gold colors */
    --color-brass-light: rgb(205, 179, 128);
    --color-brass-mid: rgb(181, 155, 106);
    --color-brass-dark: rgb(143, 119, 71);
    --color-brass-shadow: rgb(101, 86, 58);
  }

  /* Add subtle animation to certain elements */
  @keyframes pulse-subtle {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 0.9; }
  }

  /* Remove unused svg animation */
  /* svg {
    animation: pulse-subtle 4s infinite ease-in-out;
  } */

  /* Paper texture effect with warm tones */
  .paper-texture {
    background-image: url('/paper-texture.jpg');
    background-repeat: repeat;
    background-size: 500px;
    mix-blend-mode: color-burn;
    opacity: 0.15;
    filter: sepia(35%) brightness(0.85);
  }

  /* Pentagram background */
  .pentagram {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M50 2 L50 98 M2 50 L98 50 M26 26 L74 74 M26 74 L74 26 M33 15 L67 85 M15 33 L85 67 M15 67 L85 33 M33 85 L67 15'/%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M50 5 L61 40 L97 40 L68 60 L79 95 L50 75 L21 95 L32 60 L3 40 L39 40 Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }

  /* Western text styling */
  .western-text {
    letter-spacing: 0.15em;
    text-transform: uppercase;
    position: relative;
    color: var(--color-brass-light);
    text-shadow: 
      -1px -1px 0 rgba(0,0,0,0.3),
      2px 2px 0 rgba(0,0,0,0.3),
      0 0 5px rgba(205, 179, 128, 0.2);
  }

  .western-text::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='none' stroke='%23896c4e' stroke-width='0.5' d='M0,0 L20,20 M20,0 L0,20'/%3E%3C/svg%3E");
    opacity: 0.1;
    z-index: -1;
  }

  /* Wanted poster styling with burnt paper tones */
  .wanted-poster {
    position: relative;
    padding: 1.5rem;
    background-color: rgba(165, 142, 119, 0.04);
    box-shadow: 
      inset 0 0 30px rgba(137, 108, 78, 0.05),
      0 0 10px rgba(0,0,0,0.2);
    border: 8px solid transparent;
    border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75' viewBox='0 0 75 75'%3E%3Cpath fill='none' stroke='%238f7747' stroke-width='1' d='M0,0 L75,0 L75,75 L0,75 L0,0 Z M15,15 L60,15 L60,60 L15,60 L15,15 Z'/%3E%3C/svg%3E") 25 stretch;
  }

  .wanted-poster::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(143, 119, 71, 0.2);
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a58e77' fill-opacity='0.03' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }

  .wanted-poster::after {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-family: 'Fredericka the Great', serif;
    font-size: 0.65rem;
    color: rgba(143, 119, 71, 0.4);
    letter-spacing: 0.1em;
    transform: rotate(-2deg);
  }

  .wanted-poster-container {
    position: relative;
  }

  .wanted-poster-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(165, 142, 119, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(165, 142, 119, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  /* Occult badge styling with brass accents */
  .occult-badge {
    position: relative;
  }

  .occult-badge::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: rgba(143, 119, 71, 0.15);
    transform: rotate(45deg);
    z-index: -1;
  }

  .occult-badge::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='1' d='M50 5 L61 40 L97 40 L68 60 L79 95 L50 75 L21 95 L32 60 L3 40 L39 40 Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.4;
    z-index: -1;
  }

  /* Occult seal styling with paper and brass tones */
  .occult-seal {
    position: relative;
    display: inline-block;
    transform: rotate(-5deg);
    opacity: 0.8;
  }

  .occult-seal span {
    display: inline-block;
    padding: 0.25rem 1rem;
    border: 2px solid var(--color-brass-dark);
    color: var(--color-brass-mid);
    font-family: 'Fredericka the Great', serif;
    font-weight: bold;
    font-size: 0.875rem;
    letter-spacing: 0.15em;
    background-color: rgba(165, 142, 119, 0.05);
    text-transform: uppercase;
  }

  .occult-seal::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.4;
    z-index: -1;
  }

  /* Standard button styling */
  .standard-button {
    border: 2px solid var(--color-brass-dark);
    transition: all 0.2s ease;
    position: relative;
  }

  .standard-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .standard-button:active:not(:disabled) {
    transform: translateY(1px);
  }

  /* Western style button with brass and paper tones */
  .western-button {
    position: relative;
    border: 2px solid rgba(143, 119, 71, 0.7);
    background-color: rgba(165, 142, 119, 0.05);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: all 0.2s ease;
    overflow: hidden;
  }

  .western-button::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: rgba(143, 119, 71, 0.15);
    transform: rotate(45deg);
    z-index: -1;
  }

  .western-button:hover {
    background-color: rgba(143, 119, 71, 0.2);
  }

  .western-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-brass-mid), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .western-button:hover::after {
    opacity: 0.6;
  }

  .western-button:disabled {
    background-color: rgba(143, 119, 71, 0.1);
    border-color: rgba(143, 119, 71, 0.4);
    color: rgba(24, 24, 27, 0.7);
    text-shadow: 0 1px 0 rgba(205, 179, 128, 0.2);
  }

  .western-button:disabled::before {
    border-color: rgba(205, 179, 128, 0.1);
  }

  /* Form elements with paper and brass tones */
  input, textarea, select {
    background-color: rgba(24, 24, 27, 0.8);
    border-color: rgba(143, 119, 71, 0.4);
    font-family: 'Special Elite', monospace;
    letter-spacing: 0.05em;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a58e77' fill-opacity='0.03' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }

  input:focus, textarea:focus, select:focus {
    border-color: var(--color-brass-light);
    box-shadow: 0 0 0 1px rgba(165, 142, 119, 0.1);
  }

  /* Add warm paper tones to various elements */
  .bg-zinc-800 {
    background-color: rgba(39, 39, 42, 0.95);
    box-shadow: inset 0 0 30px rgba(165, 142, 119, 0.05);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a58e77' fill-opacity='0.03' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }

  /* Reduce contrast for better readability */
  .text-zinc-100 {
    color: rgba(244, 244, 245, 0.9);
  }

  .text-zinc-200 {
    color: rgba(228, 228, 231, 0.85);
  }

  .text-zinc-300 {
    color: rgba(212, 212, 216, 0.85);
  }

  /* Add brass accents to certain elements */
  .text-silver-300 {
    color: var(--color-brass-light);
  }

  .text-silver-400 {
    color: var(--color-brass-mid);
  }

  /* Add burnt paper edges to sections */
  .border-silver-700 {
    border-color: rgba(143, 119, 71, 0.5);
  }

  /* Style gradients with brass tones */
  .bg-gradient-to-r, .bg-gradient-to-l {
    --tw-gradient-to: rgba(181, 155, 106, 0.5);
  }

  /* Add brass highlights to headings */
  h1, h2 {
    text-shadow: 
      -1px -1px 0 rgba(0,0,0,0.3),
      1px 1px 0 rgba(0,0,0,0.3),
      0 0 5px rgba(205, 179, 128, 0.2);
  }

  /* Add burnt paper effect to edges */
  .border-double {
    border-color: rgba(137, 108, 78, 0.4);
  }

  /* Remove unused hr selector */
  /* Western-style decorative dividers - not used */
  /* hr {
    border: 0;
    height: 1px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='4' viewBox='0 0 200 4'%3E%3Cpath fill='none' stroke='%238f7747' stroke-width='1' stroke-dasharray='8 4' d='M0,2 L200,2'/%3E%3C/svg%3E");
    margin: 1.5rem 0;
    opacity: 0.5;
  } */

  /* Add weathered edges to the page */
  main::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background-image: 
      radial-gradient(circle at 15% 0%, rgba(137, 108, 78, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 85% 0%, rgba(137, 108, 78, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 15% 100%, rgba(137, 108, 78, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 85% 100%, rgba(137, 108, 78, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 0% 50%, rgba(137, 108, 78, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 100% 50%, rgba(137, 108, 78, 0.1) 0%, transparent 25%);
  }

  /* Occult background elements for header */
  .occult-background {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .occult-symbol-outer {
    position: absolute;
    width: 300px;
    height: 300px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%238f7747' stroke-width='0.3' d='M50 2 L50 98 M2 50 L98 50 M26 26 L74 74 M26 74 L74 26 M33 15 L67 85 M15 33 L85 67 M15 67 L85 33 M33 85 L67 15'/%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%238f7747' stroke-width='0.3'/%3E%3Cpath fill='none' stroke='%238f7747' stroke-width='0.3' d='M50 5 L61 40 L97 40 L68 60 L79 95 L50 75 L21 95 L32 60 L3 40 L39 40 Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.15;
  }

  .occult-symbol-inner {
    position: absolute;
    width: 200px;
    height: 200px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%238f7747' stroke-width='0.4' d='M50 10 C50 8.34 13.66 7 12 7 C10.34 7 9 8.34 9 10 C9 11.66 10.34 13 12 13 L12 17 M12 13 L15 13 M12 15 L15 15'/%3E%3Cpath fill='none' stroke='%238f7747' stroke-width='0.4' d='M30 30 L70 70 M30 70 L70 30 M40 20 L60 80 M20 40 L80 60 M20 60 L80 40 M40 80 L60 20'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
    animation: slow-spin 60s linear infinite;
  }

  @keyframes slow-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Add styling for the occult symbol decorative elements */
  .occult-symbol-tiny {
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='1' d='M12 2 L14 9 L21 9 L15 14 L17 21 L12 17 L7 21 L9 14 L3 9 L10 9 Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.6;
  }
  
  .occult-symbol-small {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M12 2 L14 9 L21 9 L15 14 L17 21 L12 17 L7 21 L9 14 L3 9 L10 9 Z'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.3' d='M12 6 L12 18 M6 12 L18 12 M8 8 L16 16 M8 16 L16 8'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-eye {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M12 7 C5 7 3 12 3 12 C3 12 5 17 12 17 C19 17 21 12 21 12 C21 12 19 7 12 7 Z'/%3E%3Ccircle cx='12' cy='12' r='3' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-key {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M10 8 C7.8 8 6 9.8 6 12 C6 14.2 7.8 16 10 16 C11.5 16 12.7 15.2 13.4 14 L18 14 L18 16 L16 16 L16 18 L14 18 L14 16 L13.4 16 C12.7 17.2 11.5 18 10 18 C6.7 18 4 15.3 4 12 C4 8.7 6.7 6 10 6 C11.5 6 12.9 6.6 14 7.5'/%3E%3Ccircle cx='10' cy='12' r='1.5' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-book {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M7 6 C7 6 7 5 8 5 L16 5 C17 5 17 6 17 6 L17 18 C17 18 17 19 16 19 L8 19 C7 19 7 18 7 18 L7 6 Z'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.3' d='M9 8 L15 8 M9 11 L15 11 M9 14 L15 14 M9 17 L13 17'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M6 7 L18 7 M6 17 L18 17'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-cipher {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M7 8 L10 8 M14 8 L17 8 M6 12 L9 12 M15 12 L18 12 M7 16 L11 16 M13 16 L17 16'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M11 7 L13 9 M11 9 L13 7 M10 11 L12 13 M10 13 L12 11 M12 15 L14 17 M12 17 L14 15'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-moon {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M16 12 C16 8.69 13.31 6 10 6 C10 6 11 9 11 12 C11 15 10 18 10 18 C13.31 18 16 15.31 16 12 Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-sun {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Ccircle cx='12' cy='12' r='4' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M12 4 L20 12 L12 20 L4 12 Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  .occult-symbol-scroll {
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M7 6 C7 6 7 5 8 5 L16 5 C17 5 17 6 17 6 L17 18 C17 18 17 19 16 19 L8 19 C7 19 7 18 7 18 L7 6 Z'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.3' d='M9 8 L15 8 M9 11 L15 11 M9 14 L15 14 M9 17 L13 17'/%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M6 7 L18 7 M6 17 L18 17'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
  
  /* Occult cipher visualization */
  .occult-sigil-container {
    border: 1px solid rgba(137, 108, 78, 0.3);
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
  
  .sigil-background {
    border-radius: 50%;
  }
  
  .sigil-inner {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background-color: var(--sigil-color);
    opacity: 0.7;
    animation: sigil-rotate 8s linear infinite;
  }
  
  .sigil-outer {
    background: transparent;
    border: 1px solid var(--sigil-color);
    border-radius: 50%;
    animation: sigil-pulse 4s infinite alternate;
  }
  
  @keyframes sigil-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes sigil-pulse {
    0% { transform: scale(0.8); opacity: 0.3; }
    100% { transform: scale(1.1); opacity: 0.7; }
  }
  
  .occult-rune {
    border: 1px solid var(--rune-color);
    color: var(--rune-color);
    animation: rune-pulse 3s infinite alternate;
    animation-delay: var(--rune-delay);
    position: relative;
    overflow: hidden;
  }
  
  .rune-svg-container {
    width: 100%;
    height: 100%;
    animation: rune-rotate 10s linear infinite;
    animation-delay: var(--rune-delay);
    animation-direction: alternate;
  }
  
  @keyframes rune-pulse {
    0%, 70% { opacity: 0.7; border-color: var(--rune-color); }
    20%, 100% { opacity: 1; border-color: hsla(0, 0%, 100%, 0.3); }
  }
  
  @keyframes rune-rotate {
    0% { transform: rotate(var(--rune-rotation)); }
    100% { transform: rotate(calc(var(--rune-rotation) + 180deg)); }
  }
</style>
