<script lang="ts">
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
  let activeTab = 'encode'; // 'encode' or 'decode'
  
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
      console.log(`Loaded book: ${book.name} (${bookContent.length} characters, ${parsedBook.pages.length} pages)`);
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
  <title>The Herbalist's Cipher</title>
  <meta name="description" content="An ancient cipher system for encoding herbal knowledge and occult wisdom" />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen bg-stone-900 text-stone-200 font-serif">
  <!-- Header with mystical styling -->
  <div class="bg-gradient-to-b from-stone-900 to-emerald-950 border-b border-emerald-700">
    <header class="container mx-auto px-4 py-12 text-center">
      <div class="relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 rounded-full border-2 border-emerald-500 opacity-10"></div>
          <div class="w-48 h-48 rounded-full border border-emerald-500 opacity-5 absolute"></div>
          <div class="w-64 h-64 rounded-full border border-emerald-500 opacity-5 absolute"></div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-2 font-display tracking-widest text-emerald-400 relative z-10">
          THE HERBALIST'S CIPHER
        </h1>
        <div class="flex justify-center items-center gap-4 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-emerald-700"></div>
          <p class="text-sm uppercase tracking-widest font-semibold text-stone-400">Ancient Wisdom • Sacred Knowledge • Hidden Truths</p>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-emerald-700"></div>
        </div>
      </div>
    </header>
  </div>

  <!-- Main Content -->
  <div class="container mx-auto px-4 py-8">
    <!-- Cipher Tool Section -->
    <section class="mb-12 max-w-5xl mx-auto">
      <div class="bg-stone-800 border border-stone-700 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-stone-700 bg-gradient-to-r from-stone-800 to-emerald-950">
          <h2 class="text-2xl font-bold text-center font-display tracking-wider text-emerald-400">ANCIENT ENCODING RITUAL</h2>
          <div class="flex justify-center mt-2">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div class="w-2 h-2 rounded-full bg-emerald-600"></div>
              <div class="w-2 h-2 rounded-full bg-emerald-700"></div>
            </div>
          </div>
        </div>
        
        <!-- Book and Keyword Selection -->
        <div class="p-6 bg-stone-800">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label for="book-select" class="block text-stone-300 mb-2 font-semibold uppercase text-sm tracking-wider">Select Sacred Text</label>
              <select 
                id="book-select" 
                bind:value={selectedBook}
                class="w-full bg-stone-700 border border-stone-600 rounded-md px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-serif"
              >
                <option value="" disabled>Choose a sacred text...</option>
                {#each AVAILABLE_BOOKS as book}
                  <option value={book.id}>{book.name} ({book.author})</option>
                {/each}
              </select>
              {#if isLoading}
                <p class="mt-2 text-stone-400 italic text-sm">Invoking text from the beyond...</p>
              {/if}
              {#if parsedBook}
                <p class="mt-2 text-stone-400 text-sm">
                  <span class="font-semibold text-emerald-400">{parsedBook.pages.length}</span> pages of ancient wisdom
                </p>
              {/if}
              {#if selectedBook}
                {#if !isLoading}
                  {#if parsedBook}
                    {#if AVAILABLE_BOOKS.find(b => b.id === selectedBook)?.description}
                      <p class="mt-2 text-stone-400 text-sm italic">
                        {AVAILABLE_BOOKS.find(b => b.id === selectedBook)?.description}
                      </p>
                    {/if}
                  {/if}
                {/if}
              {/if}
            </div>
            <div>
              <label for="keyword" class="block text-stone-300 mb-2 font-semibold uppercase text-sm tracking-wider">Mystical Key</label>
              <input 
                type="text" 
                id="keyword" 
                bind:value={keyword}
                placeholder="Enter your mystical key..."
                class="w-full bg-stone-700 border border-stone-600 rounded-md px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-serif"
              />
              {#if keyword}
                <p class="mt-2 text-stone-400 text-sm">
                  Numerological value: <span class="font-semibold text-emerald-400">{cipher.generateSeedFromKeyword(keyword)}</span>
                </p>
              {/if}
            </div>
          </div>

          <!-- Tabs for Encode/Decode -->
          <div class="mb-6 border-b border-stone-700">
            <div class="flex">
              <button 
                class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'encode' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-stone-400 hover:text-emerald-300'}`}
                on:click={() => setActiveTab('encode')}
              >
                Encode Secrets
              </button>
              <button 
                class={`py-3 px-6 font-semibold uppercase text-sm tracking-wider ${activeTab === 'decode' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-stone-400 hover:text-emerald-300'}`}
                on:click={() => setActiveTab('decode')}
              >
                Reveal Secrets
              </button>
            </div>
          </div>

          <!-- Encode Section -->
          {#if activeTab === 'encode'}
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="input-text" class="block text-stone-300 mb-2 font-semibold uppercase text-sm tracking-wider">Secret to Conceal</label>
                  <textarea 
                    id="input-text" 
                    bind:value={inputText}
                    placeholder="Enter the knowledge you wish to conceal..."
                    class="w-full bg-stone-700 border border-stone-600 rounded-md px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 h-48 font-serif"
                  ></textarea>
                </div>
                
                <div>
                  <label for="encoded-text" class="block text-stone-300 mb-2 font-semibold uppercase text-sm tracking-wider">Encoded Sigil</label>
                  <div class="relative">
                    <textarea 
                      id="encoded-text" 
                      bind:value={encodedText}
                      readonly
                      placeholder="Your encoded sigil will appear here..."
                      class="w-full bg-stone-700 border border-stone-600 rounded-md px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 h-48 font-serif"
                    ></textarea>
                    {#if encodedText}
                      <button 
                        class="absolute right-2 bottom-2 bg-emerald-800 hover:bg-emerald-700 text-stone-200 p-2 rounded-md"
                        on:click={() => navigator.clipboard.writeText(encodedText)}
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center mb-6">
                <button 
                  class="px-8 py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-stone-200 rounded-md font-semibold uppercase text-sm tracking-wider transition duration-300 border border-emerald-700 shadow-lg"
                  on:click={encodeMessage}
                  disabled={isLoading || !selectedBook || !keyword || !inputText}
                >
                  {#if isLoading}
                    Channeling...
                  {:else}
                    Encode Secret
                  {/if}
                </button>
              </div>
            </div>
          {:else}
            <!-- Decode Section -->
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="encoded-input" class="block text-stone-300 mb-2 font-semibold uppercase text-sm tracking-wider">Encoded Sigil</label>
                  <textarea 
                    id="encoded-input" 
                    bind:value={encodedText}
                    placeholder="Paste the encoded sigil here..."
                    class="w-full bg-stone-700 border border-stone-600 rounded-md px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 h-48 font-serif"
                  ></textarea>
                </div>
                
                <div>
                  <label for="decoded-text" class="block text-stone-300 mb-2 font-semibold uppercase text-sm tracking-wider">Revealed Secret</label>
                  <div class="relative">
                    <textarea 
                      id="decoded-text" 
                      bind:value={decodedText}
                      readonly
                      placeholder="The hidden knowledge will be revealed here..."
                      class="w-full bg-stone-700 border border-stone-600 rounded-md px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 h-48 font-serif"
                    ></textarea>
                    {#if decodedText}
                      <button 
                        class="absolute right-2 bottom-2 bg-emerald-800 hover:bg-emerald-700 text-stone-200 p-2 rounded-md"
                        on:click={() => navigator.clipboard.writeText(decodedText)}
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center mb-6">
                <button 
                  class="px-8 py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-stone-200 rounded-md font-semibold uppercase text-sm tracking-wider transition duration-300 border border-emerald-700 shadow-lg"
                  on:click={decodeMessage}
                  disabled={isLoading || !selectedBook || !keyword || !encodedText}
                >
                  {#if isLoading}
                    Divining...
                  {:else}
                    Reveal Secret
                  {/if}
                </button>
              </div>
            </div>
          {/if}

          <!-- Mystical Seal -->
          <div class="mt-8 flex justify-center">
            <div class="relative">
              <div class="w-24 h-24 rounded-full border border-emerald-700 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full border border-emerald-600 flex items-center justify-center">
                  <div class="w-10 h-10 rounded-full border border-emerald-500 flex items-center justify-center">
                    <div class="w-6 h-6 rounded-full bg-emerald-900"></div>
                  </div>
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <p class="text-xs text-emerald-500 font-semibold tracking-widest rotate-45">PROTECTED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="mb-12 max-w-4xl mx-auto">
      <div class="bg-stone-800 border border-stone-700 rounded-lg p-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center font-display tracking-wider text-emerald-400 border-b border-stone-700 pb-4">THE ANCIENT ART OF CIPHER CRAFT</h2>
        
        <div class="space-y-6 text-stone-300">
          <p class="italic font-semibold">For generations, our kind has protected sacred knowledge from those who would misuse it. The cipher ritual allows us to share wisdom only with those who possess the key:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-stone-700 rounded-lg p-4 bg-gradient-to-br from-stone-800 to-stone-900">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center mr-3">
                  <span class="text-emerald-400 font-bold">1</span>
                </div>
                <h3 class="text-lg font-semibold text-emerald-400">Select Sacred Text</h3>
              </div>
              <p class="text-stone-400">Choose one of the ancient texts that both you and your confidant possess. These texts contain the patterns that will conceal your message.</p>
            </div>
            
            <div class="border border-stone-700 rounded-lg p-4 bg-gradient-to-br from-stone-800 to-stone-900">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center mr-3">
                  <span class="text-emerald-400 font-bold">2</span>
                </div>
                <h3 class="text-lg font-semibold text-emerald-400">Establish Mystical Key</h3>
              </div>
              <p class="text-stone-400">Use a word of power known only to you and your confidant. This key shifts the starting position in the text, adding another layer of protection.</p>
            </div>
            
            <div class="border border-stone-700 rounded-lg p-4 bg-gradient-to-br from-stone-800 to-stone-900">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center mr-3">
                  <span class="text-emerald-400 font-bold">3</span>
                </div>
                <h3 class="text-lg font-semibold text-emerald-400">Encode Your Wisdom</h3>
              </div>
              <p class="text-stone-400">Each word in your message is transformed into a sigil based on its position in the text, accounting for the mystical key's influence.</p>
            </div>
            
            <div class="border border-stone-700 rounded-lg p-4 bg-gradient-to-br from-stone-800 to-stone-900">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center mr-3">
                  <span class="text-emerald-400 font-bold">4</span>
                </div>
                <h3 class="text-lg font-semibold text-emerald-400">Share Safely</h3>
              </div>
              <p class="text-stone-400">The encoded message may be transmitted through any means without fear of interception by the uninitiated. Only those with both the text and key can reveal its secrets.</p>
            </div>
          </div>
          
          <div class="mt-8 p-5 bg-stone-900 rounded-lg border-l-4 border-amber-700">
            <p class="text-amber-500 font-semibold">CAUTION TO THE WISE</p>
            <p class="text-stone-400 text-sm mt-2">Be mindful that certain entities beyond the veil may possess means to intercept or decode our communications. Exercise extreme caution when discussing powerful herbs, potent rituals, or entities from the outer realms. For matters of greatest secrecy, use only in-person meetings at sacred sites during the proper moon phases.</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Footer -->
  <footer class="bg-stone-950 py-8 text-stone-500 border-t border-stone-800">
    <div class="container mx-auto px-4 text-center">
      <div class="mb-4 flex justify-center">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-emerald-900"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-800"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-900"></div>
        </div>
      </div>
      <p class="font-display text-sm text-emerald-700 tracking-widest">THE HERBALIST'S CIPHER</p>
      <p class="text-xs mt-2 text-stone-600">ANCIENT WISDOM · PROTECTED KNOWLEDGE · UNDER THE FULL MOON</p>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    background-color: rgb(28, 25, 23); /* stone-900 */
    color: rgb(231, 229, 228); /* stone-200 */
  }
  
  /* Custom font classes */
  .font-display {
    font-family: 'Cinzel', serif;
  }
  
  .font-serif {
    font-family: 'Cormorant Garamond', serif;
  }
</style>
