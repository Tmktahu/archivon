<script lang="ts">
  import { CRAFTING_CATEGORIES, CRAFTING_JOBS } from '$lib/models/useConstants';
  import { useCrafting } from '$lib/models/useCrafting';

  export let newRecipeName = '';
  export let newRecipeAmount = 1;
  export let newRecipeCategory = CRAFTING_CATEGORIES.BASIC;
  export let newRecipeJob = CRAFTING_JOBS.NONE;
  export let newRecipeExperience = 0;
  export let newRecipeComponents = [{ name: '', amount: 1 }];
  const { createRecipe } = useCrafting();

  async function submit() {
    const recipeData = {
      name: newRecipeName,
      amount: newRecipeAmount,
      category: newRecipeCategory,
      job: newRecipeJob,
      experience: newRecipeExperience,
      components: newRecipeComponents,
    };

    try {
      await createRecipe(recipeData);

      // Reset form after successful creation
      newRecipeName = '';
      newRecipeAmount = 1;
      newRecipeCategory = CRAFTING_CATEGORIES.BASIC;
      newRecipeJob = CRAFTING_JOBS.NONE;
      newRecipeExperience = 0;
      newRecipeComponents = [{ name: '', amount: 1 }];
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  }

  function addComponent() {
    newRecipeComponents = [...newRecipeComponents, { name: '', amount: 1 }];
  }

  function removeComponent(index: number) {
    newRecipeComponents = newRecipeComponents.filter((_, i) => i !== index);
  }

  function updateComponentName(index: number, value: string) {
    newRecipeComponents[index].name = value;
    newRecipeComponents = [...newRecipeComponents]; // Trigger reactivity
  }

  function updateComponentAmount(index: number, value: number) {
    newRecipeComponents[index].amount = value;
    newRecipeComponents = [...newRecipeComponents]; // Trigger reactivity
  }
</script>

<div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 flex flex-col h-full relative">
  <div
    class="absolute inset-x-0 top-8 bottom-8 bg-contain bg-center bg-no-repeat opacity-[0.01] pointer-events-none"
    style="background-image: url('/images/logo.png'); filter: sepia(100%) hue-rotate(10deg) saturate(400%);"
  ></div>

  <h3 class="text-lg text-brass-light/90 font-display tracking-wider mb-3 border-b border-zinc-700/40 pb-2 relative z-10">Create New Recipe</h3>

  <div class="flex flex-col flex-grow overflow-hidden relative z-10">
    <form class="flex flex-col h-full" on:submit|preventDefault={submit}>
      <div class="flex-shrink-0">
        <div class="mb-2">
          <label for="recipe-name" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Recipe Name</label>
          <input
            id="recipe-name"
            type="text"
            bind:value={newRecipeName}
            class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
            placeholder="Enter recipe name"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          <div>
            <label for="recipe-amount" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Amount</label>
            <input
              id="recipe-amount"
              type="number"
              bind:value={newRecipeAmount}
              min="1"
              class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
              required
            />
          </div>

          <div>
            <label for="recipe-experience" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Experience</label>
            <input
              id="recipe-experience"
              type="number"
              bind:value={newRecipeExperience}
              min="-1"
              class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label for="recipe-category" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Category</label>
            <div class="relative">
              <select
                id="recipe-category"
                bind:value={newRecipeCategory}
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom text-sm"
                required
              >
                {#each Object.values(CRAFTING_CATEGORIES) as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
              <svg class="w-3 h-3 text-silver-400/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div>
            <label for="recipe-job" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Required Job</label>
            <div class="relative">
              <select
                id="recipe-job"
                bind:value={newRecipeJob}
                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom text-sm"
              >
                {#each Object.values(CRAFTING_JOBS) as job}
                  <option value={job}>{job}</option>
                {/each}
              </select>
              <svg class="w-3 h-3 text-silver-400/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col flex-grow min-h-0 overflow-hidden">
        <div class="flex-shrink-0 flex justify-between items-center mb-1">
          <span class="text-brass-mid/90 text-xs uppercase tracking-wider font-semibold">Components</span>
          <button type="button" on:click={addComponent} class="text-xs px-2 py-0.5 bg-zinc-700/60 text-brass-light/90 hover:bg-zinc-700/80 transition-colors"> + ADD </button>
        </div>

        <div class="overflow-y-auto flex-grow min-h-0 space-y-2">
          {#each newRecipeComponents as component, index}
            <div class="flex items-center space-x-2 p-1.5 border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-700/20 transition-colors">
              <input
                type="text"
                value={component.name}
                on:input={(e) => updateComponentName(index, (e.target as HTMLInputElement).value)}
                placeholder="Component name"
                class="flex-grow bg-zinc-800/40 border border-zinc-700/50 p-1 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-xs"
              />
              <input
                type="number"
                value={component.amount}
                on:input={(e) => updateComponentAmount(index, parseInt((e.target as HTMLInputElement).value) || 1)}
                min="1"
                class="w-16 bg-zinc-800/40 border border-zinc-700/50 p-1 text-brass-light/90 focus:outline-none focus:border-brass-mid/70 typewriter text-xs"
                placeholder="Qty"
              />
              <button type="button" on:click={() => removeComponent(index)} class="text-silver-500/80 hover:text-silver-300/90 transition-colors" title="Remove component">
                ✖
              </button>
            </div>
          {/each}
        </div>

        <div class="flex-shrink-0 border-t border-zinc-700/50 pt-3 mt-3">
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-zinc-800/60 border border-zinc-700/50 py-1.5 px-4 text-brass-light/90 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter"
            >
              CREATE RECIPE
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
