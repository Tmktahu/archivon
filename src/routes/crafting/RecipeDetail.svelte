<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CraftingRecipe } from '$lib/models/useCrafting';
  import type { Item } from '$lib/models/useItems';
  import { CRAFTING_CATEGORIES, CRAFTING_JOBS } from '$lib/models/useConstants';
  import { useCrafting } from '$lib/models/useCrafting';
  import RecipeCreateForm from './RecipeCreateForm.svelte';

  let recipe: CraftingRecipe | null = null;
  export let isAdmin: boolean = false;

  import { onMount } from 'svelte';
  import { EventBus, Events } from '$lib/eventbus';
  import { useItems } from '$lib/models/useItems';

  onMount(() => {
    EventBus.on(Events.SELECT_RECIPE, (receivedRecipe) => {
      console.log('Selected recipe:', receivedRecipe);
      recipe = receivedRecipe as CraftingRecipe;
      isEditing = false;
    });
  });

  let isEditing = false;

  const dispatch = createEventDispatcher();
  const { updateRecipe, deleteRecipe: deleteRecipeApi } = useCrafting();
  const { getItemsByName } = useItems();

  function startEditing() {
    isEditing = true;
  }

  function cancelEditing() {
    isEditing = false;
  }

  async function saveEditedRecipe() {
    if (!recipe) return;
    await updateRecipe(recipe);
    isEditing = false;
    EventBus.emit(Events.UPDATE_RECIPE_LIST);
  }

  async function deleteRecipe() {
    if (!recipe) return;
    await deleteRecipeApi(recipe.id);
    recipe = null;
  }

  function clearSelectedRecipe() {
    recipe = null;
    EventBus.emit(Events.CLEAR_SELECTED_RECIPE);
  }

  function addComponentToRecipe() {
    if (!recipe) return;
    recipe.components.push({ name: '', amount: 1 });
  }

  function removeComponentFromRecipe(index: number) {
    if (!recipe) return;
    recipe.components.splice(index, 1);
  }
  let componentItems: Item[] = [];
  let quantity: number = 1;
  let markup: number = 1;

  $: finalPrice = totalNpcPrice * quantity * markup;
  let totalNpcPrice: number = 0;

  // Fetch component item data and calculate total NPC price whenever recipe changes
  $: if (recipe && recipe.components && recipe.components.length > 0) {
    const componentNames = recipe.components.map((c) => c.name).filter(Boolean);
    if (componentNames.length > 0) {
      getItemsByName(componentNames).then((items) => {
        componentItems = items;
        totalNpcPrice = recipe!.components.reduce((sum, component) => {
          const item = items.find((i) => i.name === component.name);
          if (!item) return sum;
          return sum + item.npcPrice * (component.amount || 1);
        }, 0);
      });
    } else {
      componentItems = [];
      totalNpcPrice = 0;
    }
  } else {
    componentItems = [];
    totalNpcPrice = 0;
  }
</script>

{#if recipe}
  <div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 h-full flex flex-col relative">
    <div
      class="absolute inset-x-0 top-8 bottom-8 bg-contain bg-center bg-no-repeat opacity-[0.01] pointer-events-none"
      style="background-image: url('/images/logo.png'); filter: sepia(100%) hue-rotate(10deg) saturate(400%);"
    ></div>

    <div class="flex justify-between items-start mb-3 border-b border-zinc-700/40 pb-2 relative z-10">
      <h3 class="text-lg text-brass-light/90 font-display tracking-wider">{recipe!.name}</h3>
      <div class="flex items-center">
        {#if isAdmin}
          <button class="text-red-400/80 hover:text-red-400 transition-colors text-sm" on:click={deleteRecipe} title="Delete Recipe"> ☠ </button>
        {/if}
        <button class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-sm ml-2" on:click={startEditing} title="Edit Recipe"> ✎ </button>
        <button class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-base ml-2" on:click={clearSelectedRecipe} title="Close Recipe"> ⨯ </button>
      </div>
    </div>

    {#if isEditing}
      <div class="flex flex-col flex-grow min-h-0 overflow-hidden">
        <div class="flex flex-col flex-grow min-h-0 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 overflow-hidden">
            <div>
              <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Name</h4>
              <input
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                bind:value={recipe.name}
              />
            </div>
            <div>
              <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Amount</h4>
              <input
                type="number"
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                bind:value={recipe.amount}
              />
            </div>
            <div>
              <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Category</h4>
              <select
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom text-sm"
                bind:value={recipe.category}
              >
                {#each Object.values(CRAFTING_CATEGORIES) as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            <div>
              <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Job</h4>
              <select
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom text-sm"
                bind:value={recipe.job}
              >
                {#each Object.values(CRAFTING_JOBS) as job}
                  <option value={job}>{job}</option>
                {/each}
              </select>
            </div>
            <div>
              <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Experience</h4>
              <input
                type="number"
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                bind:value={recipe.experience}
              />
            </div>
            <div class="md:col-span-2 flex flex-col flex-grow min-h-0 overflow-hidden">
              <div class="flex-shrink-0 flex justify-between items-center mb-1">
                <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider font-semibold">Components</h4>
                <button type="button" class="text-xs px-2 py-0.5 bg-zinc-700/60 text-brass-light/90 hover:bg-zinc-700/80 transition-colors" on:click={addComponentToRecipe}
                  >+ ADD</button
                >
              </div>
              <div class="overflow-y-auto flex-grow min-h-0 space-y-2">
                {#each recipe.components as component, index}
                  <div class="flex items-center space-x-2 p-1.5 border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-700/20 transition-colors">
                    <input
                      class="flex-grow bg-zinc-800/40 border border-zinc-700/50 p-1 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-xs"
                      placeholder="Component Name"
                      bind:value={component.name}
                    />
                    <input
                      type="number"
                      class="w-16 bg-zinc-800/40 border border-zinc-700/50 p-1 text-brass-light/90 focus:outline-none focus:border-brass-mid/70 typewriter text-xs"
                      placeholder="Qty"
                      bind:value={component.amount}
                    />
                    <button
                      type="button"
                      class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-xs"
                      on:click={() => removeComponentFromRecipe(index)}
                      title="Remove Component">✖</button
                    >
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
        <div class="flex-shrink-0 border-t border-zinc-700/50 pt-3 mt-3">
          <div class="flex justify-end gap-2">
            <button
              class="bg-zinc-800/60 border border-zinc-700/50 py-1.5 px-4 text-brass-light/90 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter"
              on:click={saveEditedRecipe}>Save</button
            >
            <button
              class="bg-zinc-800/60 border border-zinc-700/50 py-1.5 px-4 text-brass-light/90 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter"
              on:click={cancelEditing}>Cancel</button
            >
          </div>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Category</h4>
          <p class="text-white/90 text-base">{recipe.category}</p>
        </div>
        <div>
          <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Required Job</h4>
          <p class="text-white/90 text-base">{recipe.job || 'None'}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Amount Produced</h4>
          <p class="text-white/90 text-base">{recipe.amount} {recipe.amount > 1 ? 'items' : 'item'}</p>
        </div>
        <div>
          <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Experience</h4>
          <p class="text-white/90 text-base">
            {#if recipe.experience > 0}
              +{recipe.experience} XP
            {:else if recipe.experience === 0}
              No XP
            {:else}
              N/A
            {/if}
          </p>
        </div>
      </div>

      <div>
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-2 border-b border-zinc-700/50 pb-1 font-semibold">Components Required</h4>
        {#if recipe.components && recipe.components.length > 0}
          <ul class="space-y-1.5 mt-2">
            {#each recipe.components as component}
              {@const item = componentItems.find((i) => i.name === component.name)}
              {#if component}
                <li class="flex items-center justify-between p-1.5 border-b border-zinc-700/50 hover:bg-zinc-700/20 transition-colors">
                  <div>
                    <span class="text-brass-light/90 mr-2 text-base">{component.amount || 1} ×</span>
                    <span class="text-white/90 text-base">{component.name || 'Unknown Component'}</span>
                  </div>
                  <div class="text-silver-400/90 text-sm ml-2 whitespace-nowrap">
                    {#if item}
                      ＄{item.npcPrice.toFixed(2)} × {component.amount || 1} = ＄{(item.npcPrice * (component.amount || 1)).toFixed(2)}
                    {:else}
                      (Item not found)
                    {/if}
                  </div>
                </li>
              {/if}
            {/each}
          </ul>
        {:else}
          <p class="text-silver-500/80 italic text-base">No components required</p>
        {/if}
      </div>

      <div class="mt-auto border-t border-zinc-700/50 p-4 bg-zinc-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
          <div>
            <label class="block text-silver-400/90 text-xs uppercase tracking-wider mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              bind:value={quantity}
              class="w-24 bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
            />
          </div>
          <div>
            <label class="block text-silver-400/90 text-xs uppercase tracking-wider mb-1">Markup</label>
            <input
              type="number"
              min="0"
              step="0.01"
              bind:value={markup}
              class="w-24 bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
            />
          </div>
          <div>
            <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Total NPC Price (per recipe)</h4>
            <p class="text-white/90 text-base">＄{totalNpcPrice.toFixed(2)}</p>
          </div>
        </div>
        <div>
          <h4 class="text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Final Selling Price</h4>
          <p class="text-brass-light/90 text-lg font-bold">＄{finalPrice.toFixed(2)}</p>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <RecipeCreateForm
    on:submitNewRecipe={() => dispatch('submitNewRecipe')}
    on:addComponent={() => dispatch('addComponent')}
    on:removeComponent={(e) => dispatch('removeComponent', e.detail)}
    on:updateComponentName={(e) => dispatch('updateComponentName', e.detail)}
    on:updateComponentAmount={(e) => dispatch('updateComponentAmount', e.detail)}
  />
{/if}
