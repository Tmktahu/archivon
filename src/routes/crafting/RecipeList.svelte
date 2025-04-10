<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { EventBus, Events } from '$lib/eventbus';
  import { CRAFTING_CATEGORIES } from '$lib/models/useConstants';
  import type { CraftingRecipe } from '$lib/models/useCrafting';
  import { useCrafting } from '$lib/models/useCrafting';
  import { onMount } from 'svelte';

  let recipes = $state<CraftingRecipe[]>([]);
  let filteredRecipes = $state<CraftingRecipe[]>([]);
  let loading = $state(true);

  let searchQuery = $state('');
  let selectedCategory = $state('');

  const { getAllRecipes } = useCrafting();

  onMount(async () => {
    EventBus.on(Events.UPDATE_RECIPE_LIST, async () => {
      loading = true;
      const data = await getAllRecipes();
      recipes = data;
      filteredRecipes = data;
      loading = false;
    });

    loading = true;
    const data = await getAllRecipes();
    recipes = data;
    filteredRecipes = data;
    loading = false;
  });

  const dispatch = createEventDispatcher();

  function handleSelect(recipe: CraftingRecipe) {
    EventBus.emit(Events.SELECT_RECIPE, recipe);
  }

  function clearFilters() {
    searchQuery = '';
    selectedCategory = '';
  }

  function doSearch() {
    if (!searchQuery && !selectedCategory) {
      filteredRecipes = [...recipes];
      return;
    }

    let result = recipes;

    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      result = result.filter((recipe) => recipe.name.toLowerCase().includes(searchTerm) || recipe.components.some((comp) => comp.name.toLowerCase().includes(searchTerm)));
    }

    if (selectedCategory) {
      result = result.filter((recipe) => recipe.category === selectedCategory);
    }

    filteredRecipes = result;
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
        placeholder="Search recipes..."
        class="w-full bg-zinc-800/40 border border-zinc-700/40 p-1.5 pl-8 text-silver-300/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
      />
      <svg class="w-3.5 h-3.5 text-silver-500/70 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>

    <div class="relative">
      <select
        bind:value={selectedCategory}
        class="w-full bg-zinc-800/40 border border-zinc-700/40 p-1.5 text-silver-300/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom text-sm"
      >
        <option value="">All Categories</option>
        {#each Object.values(CRAFTING_CATEGORIES) as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
      <svg class="w-3 h-3 text-silver-400/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
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
    {:else if recipes.length === 0}
      <div class="p-3 text-center text-silver-500/80 italic text-sm"> No recipes found. Try creating one! </div>
    {:else if filteredRecipes.length === 0}
      <div class="p-3 text-center text-silver-500/80 italic text-sm"> No recipes match your search. Try different filters. </div>
    {:else}
      <ul class="divide-y divide-zinc-700/30">
        {#each filteredRecipes as recipe}
          <li>
            <button onclick={() => handleSelect(recipe)} class="w-full text-left p-2 hover:bg-zinc-700/30 hover:text-brass-light/80 transition-colors">
              <div class="flex justify-between items-center">
                <span class="text-silver-300/90 text-sm typewriter">{recipe.name}</span>
                <span class="text-xs px-1.5 py-0.5 bg-zinc-700/40 text-brass-light/70 rounded-sm">{recipe.category}</span>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
