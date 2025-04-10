<script lang="ts">
  // @ts-nocheck - Disabling TypeScript checking for this file as requested
  import { onMount } from 'svelte';
  import * as cipher from '$lib/cipher';
  import { AVAILABLE_BOOKS } from '$lib/models/useConstants';

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
      `<svg viewBox="0 0 24 24"><path d="M8,8 L16,8 L16,16 L8,16 Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M6,6 L18,6 L18,18 L6,18 Z" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="0.5"/></svg>`, // 9
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
      const book = AVAILABLE_BOOKS.find((b) => b.id === selectedBook);
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
  <!-- Paper texture background with subtle warm tone -->
  <div class="absolute inset-0 bg-zinc-900 opacity-90 z-0"></div>

  <!-- Logo background element -->
  <div class="absolute inset-0 flex items-center justify-center z-0 opacity-5">
    <div class="w-[800px] h-[800px] logo-background"></div>
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
          <h1 class="text-4xl md:text-6xl font-bold mb-2 font-display tracking-widest text-brass-light relative z-10 drop-shadow-sm western-text"> ARCHIVON </h1>
          <div class="flex justify-center items-center gap-4 mt-4">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-silver-500/70"></div>
            <p class="text-sm uppercase tracking-widest font-semibold text-silver-400/80">Order of Records</p>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-silver-500/70"></div>
          </div>
        </div>

        <div class="mt-4 ooc-note">
          <p class="text-sm text-silver-400/90 italic px-4 py-2 bg-zinc-800/80 border border-silver-700/50 max-w-2xl mx-auto">
            <span class="font-semibold">Out-of-Character Note:</span> This is a utility to help you encode and decode messages using the book cipher. Using this tool does not mean your
            character knows how to work with the cipher - it simply makes the process easier than doing it manually.
          </p>
        </div>
      </div></header
    >
  </div>

  <!-- Main Content -->
  <div class="container mx-auto px-4 py-8 relative z-10">
    <!-- Cipher Tool Section -->
    <section class="mb-12 max-w-5xl mx-auto relative">
      <div class="border-4 border-double border-silver-700 rounded-none shadow-xl overflow-hidden wanted-poster-container relative z-10 bg-zinc-800/30">
        <div class="p-6 border-b-2 border-silver-700">
          <h2 class="text-2xl font-bold text-center font-display tracking-wider text-silver-400 drop-shadow-sm">CIPHER UTILITY</h2>
          <div class="flex justify-center items-center mt-2">
            <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/80"></div>
            <div class="flex items-center gap-4 mx-4">
              <!-- Eye SVG with occult background (vertical orientation) -->
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
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>

              <!-- Pen SVG with occult background -->
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
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>

              <!-- Lock SVG with occult background -->
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
            <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/80"></div>
          </div>

          <!-- Book and Keyword Selection -->
          <div class="p-6 bg-transparent">
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
                        <span class="font-semibold text-silver-300">Author:</span>
                        {AVAILABLE_BOOKS.find((b) => b.id === selectedBook)?.author}
                      </p>
                      {#if AVAILABLE_BOOKS.find((b) => b.id === selectedBook)?.description}
                        <p class="mt-2 text-silver-400/80 text-sm italic">
                          {AVAILABLE_BOOKS.find((b) => b.id === selectedBook)?.description}
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
                  on:input={(e) => (keyword = e.target.value.toLowerCase())}
                  placeholder="Enter your cipher key..."
                  class="w-full bg-zinc-900/80 border-2 border-silver-700 rounded-none px-4 py-3 text-silver-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-mono text-sm h-[50px]"
                />
                {#if keyword}
                  <div class="mt-2">
                    <!-- Occult symbols representing the numeric value -->
                    <div class="mb-2">
                      <div class="grid grid-cols-5 w-full gap-1">
                        {#each String(keywordSeed).padStart(5, '0').split('') as digit, i}
                          <div
                            class="occult-rune aspect-square flex items-center justify-center"
                            style="--rune-color: hsla({keywordHue + i * 30}, 70%, {keywordBrightness}%, 0.7); --rune-delay: {i * 0.2}s; --rune-rotation: {(parseInt(digit) * 36) %
                              360}deg;"
                          >
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
            <div class="mb-6 border-b-2 border-zinc-600">
              <div class="flex">
                <button
                  class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'encode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'}`}
                  on:click={() => setActiveTab('encode')}
                >
                  <span class="flex items-center"> Encode </span>
                </button>
                <button
                  class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'decode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'}`}
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
                <div class="flex justify-center mt-4 w-full">
                  <button
                    on:click={encodeMessage}
                    disabled={!parsedBook || !keyword || !inputText || isLoading}
                    class="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-silver-300 font-semibold uppercase text-sm tracking-wider border-2 border-silver-700 focus:outline-none focus:ring-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Encode Message
                  </button>
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
                <div class="flex justify-center mt-4 w-full">
                  <button
                    on:click={decodeMessage}
                    disabled={!parsedBook || !keyword || !encodedText || isLoading}
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
          <!-- Moon SVG -->
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
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          </div>

          <!-- Star SVG -->
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
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>

          <!-- Sun SVG -->
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
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
        </div>
        <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/60"></div>
      </div>

      <p class="mb-2 text-xs typewriter text-silver-400/70">For Knowledge. For Protection. For Understanding.</p>
    </div>
  </footer>
</main>
