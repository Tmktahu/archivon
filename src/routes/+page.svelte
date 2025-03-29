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
  let isLoading = false;
  let bookContent = '';
  let parsedBook = null;
  let activeTab = 'encode'; 
  
  // Load book content from static files
  async function loadBookContent(bookId) {
    if (!bookId) return;
    
    const book = AVAILABLE_BOOKS.find(b => b.id === bookId);
    if (!book) {
      alert(`Book with ID "${bookId}" not found`);
      return;
    }
    
    isLoading = true;
    try {
      const response = await fetch(`/books/${book.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load book: ${response.statusText}`);
      }
      bookContent = await response.text();
      parsedBook = cipher.parseBookContent(bookContent);
      console.log(`Loaded book: ${book.name} (${bookContent.length} characters, ${parsedBook?.pages.length || 0} pages)`);
    } catch (error) {
      console.error('Error loading book:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to load book: ${errorMessage}`);
      parsedBook = null;
    } finally {
      isLoading = false;
    }
  }
  
  // Watch for book selection changes
  $: if (selectedBook) {
    loadBookContent(selectedBook);
  }
  
  // Encode a message using the book cipher
  function encodeMessage() {
    if (!selectedBook || !keyword || !inputText) {
      alert('Please select a book, enter a keyword, and provide text to encode');
      return;
    }
    
    if (!parsedBook) {
      alert('Book content is not loaded yet. Please try again.');
      return;
    }
    
    try {
      encodedText = cipher.encodeMessage(inputText, parsedBook, keyword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Error encoding message: ${errorMessage}`);
    }
  }
  
  // Decode a message using the book cipher
  function decodeMessage() {
    if (!selectedBook || !keyword || !encodedText) {
      alert('Please select a book, enter a keyword, and provide text to decode');
      return;
    }
    
    if (!parsedBook) {
      alert('Book content is not loaded yet. Please try again.');
      return;
    }
    
    try {
      decodedText = cipher.decodeMessage(encodedText, parsedBook, keyword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Error decoding message: ${errorMessage}`);
    }
  }
  
  function setActiveTab(tab) {
    activeTab = tab;
  }
  
  onMount(() => {
    // Any initialization code can go here
  });
</script>

<svelte:head>
  <title>Archivon | Order of Records</title>
  <meta name="description" content="A cipher system for encoding and preserving knowledge" />
  <link href="https://fonts.googleapis.com/css2?family=Rye&family=Special+Elite&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
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
          <div class="w-32 h-32 rounded-full border-2 border-silver-500/40 opacity-20"></div>
          <div class="w-48 h-48 rounded-full border-2 border-silver-500/40 opacity-15 absolute"></div>
          <div class="w-64 h-64 rounded-full border-2 border-silver-500/40 opacity-10 absolute"></div>
        </div>
        
        <div class="wanted-poster">
          <h1 class="text-4xl md:text-6xl font-bold mb-2 font-display tracking-widest text-silver-400 relative z-10 drop-shadow-sm">
            ARCHIVON
          </h1>
          <div class="flex justify-center items-center gap-4 mt-4">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-silver-500/70"></div>
            <p class="text-sm uppercase tracking-widest font-semibold text-silver-400/80">Order of Records • Est. 1872</p>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-silver-500/70"></div>
          </div>
        </div>
        
        <div class="mt-4 occult-seal">
          <span>CLASSIFIED</span>
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
          <h2 class="text-2xl font-bold text-center font-display tracking-wider text-silver-400 drop-shadow-sm">CIPHER PROTOCOL</h2>
          <div class="flex justify-center mt-2">
            <div class="flex items-center gap-3">
              <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/80"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5 text-silver-400">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v.01M8.5 8.5l.01-.01M15.5 8.5l-.01-.01M12 12v.01M8.5 15.5l.01-.01M15.5 15.5l-.01-.01M12 20v.01" />
              </svg>
              <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/80"></div>
            </div>
          </div>
        
        <!-- Book and Keyword Selection -->
        <div class="p-6 bg-zinc-800/90">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label for="book-select" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Select Source Text</label>
              <select 
                id="book-select" 
                bind:value={selectedBook}
                class="w-full bg-zinc-700 border-2 border-silver-700 rounded-none px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-serif h-[50px]"
              >
                <option value="" disabled>Choose a source text...</option>
                {#each AVAILABLE_BOOKS as book}
                  <option value={book.id}>{book.name} ({book.author})</option>
                {/each}
              </select>
              {#if isLoading}
                <p class="mt-2 text-silver-400/80 italic text-sm">Loading text from archives...</p>
              {/if}
              {#if parsedBook}
                <p class="mt-2 text-silver-400/80 text-sm">
                  <span class="font-semibold text-silver-300">{parsedBook.pages.length}</span> pages of documented knowledge
                </p>
              {/if}
              {#if selectedBook}
                {#if !isLoading}
                  {#if parsedBook}
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
                class="w-full bg-zinc-700 border-2 border-silver-700 rounded-none px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-silver-500 font-serif h-[50px]"
              />
              {#if keyword}
                <p class="mt-2 text-silver-400/80 text-sm">
                  Numeric value: <span class="font-semibold text-silver-300">{cipher.generateSeedFromKeyword(keyword)}</span>
                </p>
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
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Encode
                </span>
              </button>
              <button 
                class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'decode' ? 'border-b-2 border-silver-400 text-silver-300 bg-zinc-700/50' : 'text-silver-400/80 hover:text-silver-300 hover:bg-zinc-700/30'}`}
                on:click={() => setActiveTab('decode')}
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
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
                  <div class="relative">
                    <textarea 
                      id="input-text" 
                      bind:value={inputText}
                      placeholder="Enter the knowledge you wish to encode..."
                      class="w-full bg-zinc-700 border-2 border-silver-700 rounded-none px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-silver-500 h-48 font-serif typewriter"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <label for="encoded-output" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Encoded Output</label>
                  <div class="relative">
                    <textarea 
                      id="encoded-output" 
                      bind:value={encodedText}
                      readonly
                      placeholder="Your encoded message will appear here..."
                      class="w-full bg-zinc-700 border-2 border-silver-700 rounded-none px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-silver-500 h-48 font-serif typewriter"
                    ></textarea>
                    {#if encodedText}
                      <button 
                        class="absolute bottom-2 right-2 text-silver-400 hover:text-silver-300 focus:outline-none"
                        on:click={() => {
                          navigator.clipboard.writeText(encodedText);
                          alert('Encoded text copied to clipboard');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center">
                <button 
                  class="px-6 py-3 bg-silver-700 hover:bg-silver-600 text-zinc-900 rounded-none shadow-md font-semibold uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-silver-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed western-button"
                  on:click={encodeMessage}
                  disabled={!selectedBook || !keyword || !inputText || isLoading}
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Encode Message
                  </span>
                </button>
              </div>
            </div>
          {:else}
            <!-- Decode Section -->
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="encoded-input" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Encoded Message</label>
                  <div class="relative">
                    <textarea 
                      id="encoded-input" 
                      bind:value={encodedText}
                      placeholder="Paste the encoded message here..."
                      class="w-full bg-zinc-700 border-2 border-silver-700 rounded-none px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-silver-500 h-48 font-serif typewriter"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <label for="decoded-output" class="block text-silver-300 mb-2 font-semibold uppercase text-sm tracking-wider">Decoded Content</label>
                  <div class="relative">
                    <textarea 
                      id="decoded-output" 
                      bind:value={decodedText}
                      readonly
                      placeholder="The decoded content will be revealed here..."
                      class="w-full bg-zinc-700 border-2 border-silver-700 rounded-none px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-silver-500 h-48 font-serif typewriter"
                    ></textarea>
                    {#if decodedText}
                      <button 
                        class="absolute bottom-2 right-2 text-silver-400 hover:text-silver-300 focus:outline-none"
                        on:click={() => {
                          navigator.clipboard.writeText(decodedText);
                          alert('Decoded text copied to clipboard');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center">
                <button 
                  class="px-6 py-3 bg-silver-700 hover:bg-silver-600 text-zinc-900 rounded-none shadow-md font-semibold uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-silver-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed western-button"
                  on:click={decodeMessage}
                  disabled={!selectedBook || !keyword || !encodedText || isLoading}
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Decode Message
                  </span>
                </button>
              </div>
            </div>
          {/if}
          
          <!-- Occult Seal -->
          <div class="mt-8 flex justify-center">
            <div class="relative">
              <div class="w-24 h-24 rounded-full border-2 border-silver-700/60 flex items-center justify-center occult-badge">
                <div class="w-16 h-16 rounded-full border-2 border-silver-700/60 flex items-center justify-center">
                  <div class="w-10 h-10 rounded-full border-2 border-silver-700/60 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-6 h-6 text-silver-400">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <p class="text-xs text-silver-400 font-semibold tracking-widest rotate-45">SEALED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Footer -->
  <footer class="bg-zinc-800 py-8 text-silver-400/80 border-t-4 border-double border-silver-700 relative z-10">
    <div class="container mx-auto px-4 text-center">
      <div class="flex justify-center items-center gap-3 mb-4">
        <div class="h-px w-8 bg-gradient-to-r from-transparent to-silver-500/60"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4 text-silver-400">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v2m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5 text-silver-400">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <div class="h-px w-8 bg-gradient-to-l from-transparent to-silver-500/60"></div>
      </div>
      <p class="text-sm font-serif">
        <span class="text-silver-400">Archivon</span> • <span class="text-silver-400/70">Order of Records</span>
      </p>
      <p class="text-xs mt-2 text-silver-400/50">For the preservation of knowledge and legacy</p>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    background-color: rgb(24, 24, 27); /* zinc-900 */
    font-family: 'Special Elite', serif;
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
  
  svg {
    animation: pulse-subtle 4s infinite ease-in-out;
  }
  
  /* Paper texture effect with warm tones */
  .paper-texture {
    background-image: url('/paper-texture.jpg');
    background-repeat: repeat;
    background-size: 500px;
    mix-blend-mode: color-burn;
    opacity: 0.12;
    filter: sepia(25%) brightness(0.9);
  }
  
  /* Pentagram background */
  .pentagram {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23c9b17c' stroke-width='0.5' d='M50 5 L61 40 L97 40 L68 60 L79 95 L50 75 L21 95 L32 60 L3 40 L39 40 Z'/%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  /* Wanted poster styling with burnt paper tones */
  .wanted-poster {
    position: relative;
    padding: 1rem;
    background-color: rgba(165, 142, 119, 0.03);
    box-shadow: inset 0 0 30px rgba(137, 108, 78, 0.03);
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
    background-image: linear-gradient(rgba(165, 142, 119, 0.03) 1px, transparent 1px),
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
    font-family: 'Special Elite', monospace;
    font-weight: bold;
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    background-color: rgba(165, 142, 119, 0.05);
  }
  
  .occult-seal::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23c9b17c' stroke-width='0.5'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.4;
    z-index: -1;
  }
  
  /* Western style button with brass and paper tones */
  .western-button {
    position: relative;
    border: 2px solid rgba(143, 119, 71, 0.7);
    background-color: rgba(165, 142, 119, 0.05);
  }
  
  .western-button::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 1px solid rgba(205, 179, 128, 0.2);
    pointer-events: none;
  }
  
  /* Form elements with paper and brass tones */
  input, textarea, select {
    background-color: rgba(24, 24, 27, 0.8);
    border-color: rgba(143, 119, 71, 0.4);
  }
  
  input:focus, textarea:focus, select:focus {
    border-color: var(--color-brass-light);
    box-shadow: 0 0 0 1px rgba(165, 142, 119, 0.1);
  }
  
  /* Add warm paper tones to various elements */
  .bg-zinc-800 {
    background-color: rgba(39, 39, 42, 0.95);
    box-shadow: inset 0 0 30px rgba(165, 142, 119, 0.05);
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
    color: var(--color-silver-300);
  }
  
  .text-silver-400 {
    color: var(--color-silver-400);
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
  h1, h2, h3 {
    text-shadow: 0 0 3px rgba(205, 179, 128, 0.1);
  }
  
  /* Add burnt paper effect to edges */
  .border-double {
    border-color: rgba(137, 108, 78, 0.4);
  }
</style>
