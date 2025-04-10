<script lang="ts">
  import { onMount } from 'svelte';
  import { EventBus, Events } from '$lib/eventbus';
  import { useItems } from '$lib/models/useItems';
  import type { Item } from '$lib/models/useItems';

  let items = $state<Item[]>([]);
  let filteredItems = $state<Item[]>([]);
  let loading = $state(true);

  let searchQuery = $state('');

  const { getAllItems } = useItems();

  onMount(async () => {
    EventBus.on(Events.UPDATE_ITEM_LIST, async () => {
      loading = true;
      const data = await getAllItems();
      items = data;
      filteredItems = data;
      loading = false;
    });

    loading = true;
    const data = await getAllItems();
    items = data;
    filteredItems = data;
    loading = false;
  });

  function handleSelect(item: Item) {
    EventBus.emit(Events.SELECT_ITEM, item);
  }

  function clearFilters() {
    searchQuery = '';
  }

  function doSearch() {
    if (!searchQuery) {
      filteredItems = [...items];
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm));
  }

  $effect(() => {
    doSearch();
  });
</script>

<div class="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full overflow-hidden">
  <div class="flex-shrink-0 mb-3 space-y-2">
    <div class="relative">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search items..."
        class="w-full bg-zinc-800/40 border border-zinc-700/40 p-1.5 pl-8 text-silver-300/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
      />
      <svg class="w-3.5 h-3.5 text-silver-500/70 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>

    <button
      onclick={clearFilters}
      class="w-full bg-zinc-800/60 border border-zinc-700/40 p-1.5 text-brass-light/80 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter"
    >
      CLEAR FILTERS
    </button>
  </div>

  <div class="flex-grow overflow-y-auto min-h-0 border border-zinc-700/40 bg-zinc-800/20">
    {#if loading}
      <div class="p-3 flex justify-center items-center">
        <svg class="animate-spin h-5 w-5 text-silver-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    {:else if items.length === 0}
      <div class="p-3 text-center text-silver-500/80 italic text-sm"> No items found. Try creating one! </div>
    {:else if filteredItems.length === 0}
      <div class="p-3 text-center text-silver-500/80 italic text-sm"> No items match your search. </div>
    {:else}
      <ul class="divide-y divide-zinc-700/30">
        {#each filteredItems as item}
          <li>
            <button onclick={() => handleSelect(item)} class="w-full text-left p-2 hover:bg-zinc-700/30 hover:text-brass-light/80 transition-colors">
              <div class="flex justify-between items-center">
                <span class="text-silver-300/90 text-sm typewriter">{item.name}</span>
                <span class="text-xs px-1.5 py-0.5 bg-zinc-700/40 text-brass-light/70 rounded-sm">${item.npcPrice}</span>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
