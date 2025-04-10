<script lang="ts">
  import { onMount } from 'svelte';
  import RecipeList from './RecipeList.svelte';
  import RecipeDetail from './RecipeDetail.svelte';

  let isAdmin = $state(false);

  onMount(() => {
    // @ts-ignore
    window.makeAdmin = () => {
      isAdmin = true;
    };
  });
</script>

<main class="h-screen flex flex-col bg-zinc-900 text-silver-400 overflow-hidden">
  <!-- Background with subtle warm tone -->
  <div class="absolute inset-0 bg-zinc-900 opacity-90"></div>

  <div class="container mx-auto p-4 flex flex-col flex-grow overflow-hidden relative z-10 max-w-5xl">
    <!-- Header -->
    <div class="p-4 border-4 border-double border-zinc-700/50 bg-zinc-800/30 rounded-t-none shadow-xl flex-shrink-0 mb-4">
      <h1 class="text-2xl font-bold text-center font-display tracking-wider text-silver-400/90 drop-shadow-sm">CRAFTING RECIPES</h1>
      <div class="flex justify-center items-center mt-2">
        <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/40"></div>
        <div class="occult-symbol-outer opacity-15 mx-4"></div>
        <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/40"></div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-grow flex flex-col md:flex-row gap-4 p-4 overflow-hidden border-4 border-double border-zinc-700/50 bg-zinc-800/30">
      <!-- Left column: Recipe list and filters -->
      <RecipeList />

      <!-- Right column: Recipe details or creation form -->
      <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col h-full overflow-hidden">
        <RecipeDetail {isAdmin} />
      </div>
    </div>
  </div>
</main>
