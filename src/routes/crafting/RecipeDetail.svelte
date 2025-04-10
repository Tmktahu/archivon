<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CraftingRecipe } from '$lib/models/useCrafting';
  import { CRAFTING_CATEGORIES, CRAFTING_JOBS } from '$lib/models/useConstants';
  import { useCrafting } from '$lib/models/useCrafting';
  import RecipeCreateForm from './RecipeCreateForm.svelte';

  let recipe: CraftingRecipe | null = null;
  export let isAdmin: boolean = false;

  import { onMount } from 'svelte';
  import { EventBus, Events } from '$lib/eventbus';

  onMount(() => {
    EventBus.on(Events.SELECT_RECIPE, (receivedRecipe) => {
      console.log('Selected recipe:', receivedRecipe);
      recipe = receivedRecipe as CraftingRecipe;
      isEditing = false;
    });
  });

  let isEditing = false;

  const dispatch = createEventDispatcher();
  const { updateRecipe } = useCrafting();

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
    dispatch('recipeUpdated', recipe);
  }

  function deleteRecipe() {
    dispatch('deleteRecipe');
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
</script>

{#if recipe}
<div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 h-full flex flex-col relative">
  <div class="absolute inset-x-0 top-8 bottom-8 bg-contain bg-center bg-no-repeat opacity-[0.01] pointer-events-none" style="background-image: url('/images/logo.png'); filter: sepia(100%) hue-rotate(10deg) saturate(400%);"></div>

  <div class="flex justify-between items-start mb-3 border-b border-zinc-700/40 pb-2 relative z-10">
    <h3 class="text-lg text-brass-light/90 font-display tracking-wider">{recipe!.name}</h3>
    <div class="flex items-center">
      {#if isAdmin}
        <button class="text-red-400/80 hover:text-red-400 transition-colors text-sm" on:click={deleteRecipe} title="Delete Recipe">
          ☠
        </button>
      {/if}
      <button class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-sm ml-2" on:click={startEditing} title="Edit Recipe">
        ✎
      </button>
      <button class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-base ml-2" on:click={clearSelectedRecipe} title="Close Recipe">
        ⨯
      </button>
    </div>
  </div>

  {#if isEditing}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div>
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Name</h4>
        <input class="w-full p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" bind:value={recipe.name} />
      </div>
      <div>
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Amount</h4>
        <input type="number" class="w-full p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" bind:value={recipe.amount} />
      </div>
      <div>
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Category</h4>
        <select class="w-full p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" bind:value={recipe.category}>
          {#each Object.values(CRAFTING_CATEGORIES) as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
      <div>
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Job</h4>
        <select class="w-full p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" bind:value={recipe.job}>
          {#each Object.values(CRAFTING_JOBS) as job}
            <option value={job}>{job}</option>
          {/each}
        </select>
      </div>
      <div>
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Experience</h4>
        <input type="number" class="w-full p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" bind:value={recipe.experience} />
      </div>
      <div class="md:col-span-2">
        <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Components</h4>
        {#each recipe.components as component, index}
          <div class="flex gap-2 mb-1">
            <input class="flex-1 p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" placeholder="Component Name" bind:value={component.name} />
            <input type="number" class="w-20 p-1 bg-zinc-800/40 border border-zinc-700/40 text-white" placeholder="Amount" bind:value={component.amount} />
            <button type="button" class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-xs" on:click={() => removeComponentFromRecipe(index)} title="Remove Component">✖</button>
          </div>
        {/each}
        <button type="button" class="mt-2 px-2 py-1 bg-zinc-700/40 hover:bg-zinc-700/60 text-brass-light/80 border border-zinc-700/50 text-xs transition-colors" on:click={addComponentToRecipe}>+ ADD COMPONENT</button>
      </div>
    </div>
    <div class="mt-4 flex gap-2">
      <button class="bg-zinc-800/60 border border-zinc-700/50 py-1.5 px-4 text-brass-light/90 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter" on:click={saveEditedRecipe}>Save</button>
      <button class="bg-zinc-800/60 border border-zinc-700/50 py-1.5 px-4 text-brass-light/90 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter" on:click={cancelEditing}>Cancel</button>
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
            {#if component}
              <li class="flex items-center p-1.5 border-b border-zinc-700/50 hover:bg-zinc-700/20 transition-colors">
                <span class="text-brass-light/90 mr-2 text-base">{component.amount || 1} ×</span>
                <span class="text-white/90 text-base">{component.name || 'Unknown Component'}</span>
              </li>
            {/if}
          {/each}
        </ul>
      {:else}
        <p class="text-silver-500/80 italic text-base">No components required</p>
      {/if}
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