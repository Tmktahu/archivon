<script>
    import { onMount } from 'svelte';
    import { useCrafting } from '$lib/models/useCrafting';
    import { CRAFTING_CATEGORIES, CRAFTING_JOBS } from '$lib/models/useConstants';
    
    // Get crafting functions
    const { 
        getAllRecipes, 
        getRecipesByCategory, 
        searchRecipes,
        createRecipe,
        deleteRecipe
    } = useCrafting();

    let isAdmin = $state(false);

    onMount(() => {
        window.makeAdmin = () => {
            isAdmin = true;
        };
    });
    
    // Initialize state variables
    let searchQuery = $state('');
    let selectedCategory = $state('');
    let selectedRecipe = $state(null);
    
    // Initialize recipes directly in the script
    let recipes = $state([]);
    let filteredRecipes = $state([]);
    
    // Create new recipe form state
    let newRecipeName = $state('');
    let newRecipeAmount = $state(1);
    let newRecipeCategory = $state(CRAFTING_CATEGORIES.BASIC);
    let newRecipeJob = $state(CRAFTING_JOBS.NONE);
    let newRecipeExperience = $state(0);
    let newRecipeComponents = $state([{ name: '', amount: 1 }]);
    
    // Single effect block for filtering recipes
    $effect(async () => {
        filteredRecipes = await getAllRecipes();
        recipes = filteredRecipes;
    });

    const doSearch = () => {
        if(!searchQuery && !selectedCategory) {
            filteredRecipes = [...recipes];
            return;
        }

        if(selectedCategory) {
            filteredRecipes = searchRecipes(searchQuery, recipes).filter(recipe => recipe.category === selectedCategory);
        } else {
            filteredRecipes = searchRecipes(searchQuery, recipes);
        }
    };
    
    // Function to select a recipe
    const selectRecipe = (recipe) => {
        selectedRecipe = recipe;
    };
    
    // Function to clear selected recipe
    const clearSelectedRecipe = () => {
        selectedRecipe = null;
    };
    
    // Function to clear filters
    const clearFilters = () => {
        searchQuery = '';
        selectedCategory = '';
        filteredRecipes = [...recipes];
    };
    
    // Function to add a new component field
    const addComponent = () => {
        newRecipeComponents = [...newRecipeComponents, { name: '', amount: 1 }];
    };
    
    // Function to remove a component field
    const removeComponent = (index) => {
        newRecipeComponents = newRecipeComponents.filter((_, i) => i !== index);
    };
    
    // Function to submit the new recipe
    const submitNewRecipe = () => {
        // Filter out empty components
        const validComponents = newRecipeComponents.filter(c => c.name !== '');
        
        const recipeData = {
            name: newRecipeName,
            amount: newRecipeAmount,
            category: newRecipeCategory,
            job: newRecipeJob,
            experience: newRecipeExperience,
            components: validComponents
        };
        
        createRecipe(recipeData);
        
        // Reset form
        newRecipeName = '';
        newRecipeAmount = 1;
        newRecipeCategory = CRAFTING_CATEGORIES.BASIC;
        newRecipeJob = CRAFTING_JOBS.NONE;
        newRecipeExperience = 0;
        newRecipeComponents = [{ name: '', amount: 1 }];
        
        // Refresh recipes list after a short delay
        setTimeout(() => {
            getAllRecipes().then(data => {
                recipes = data;
                filteredRecipes = [...recipes];
            });
        }, 1000);
    };
</script>

<style>
    /* Utility styles */
    .typewriter {
        font-family: 'Special Elite', monospace;
    }
    
    /* Select custom styling */
    .select-custom {
        appearance: none;
    }
    
    /* Custom dropdown styling */
    select option {
        background-color: #1f1f23 !important;
        color: #d4d4d8 !important;
    }
    
    select option:hover, 
    select option:focus, 
    select option:active,
    select option:checked {
        background-color: #27272e !important;
        color: #e2c08d !important;
        box-shadow: 0 0 10px 100px #27272e inset !important;
        -webkit-text-fill-color: #e2c08d !important;
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(90, 78, 51, 0.5);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(122, 106, 71, 0.7);
    }
    
    /* Prevent body scroll when modal is open */
    :global(body) {
        overflow: hidden;
    }
</style>

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
            <div class="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full overflow-hidden">
                <!-- Search and filters -->
                <div class="flex-shrink-0 mb-3 space-y-2">
                    <!-- Search input -->
                    <div class="relative">
                        <input 
                            type="text" 
                            bind:value={searchQuery}
                            oninput={doSearch}
                            placeholder="Search recipes..." 
                            class="w-full bg-zinc-800/40 border border-zinc-700/40 p-1.5 pl-8 text-silver-300/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                        />
                        <svg class="w-3.5 h-3.5 text-silver-500/70 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    
                    <!-- Category filter -->
                    <div class="relative">
                        <select 
                            bind:value={selectedCategory}
                            onchange={doSearch}
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
                    
                    <!-- Clear filters button -->
                    <button 
                        onclick={clearFilters}
                        class="w-full bg-zinc-800/60 border border-zinc-700/40 p-1.5 text-brass-light/80 hover:text-brass-light/90 hover:bg-zinc-800/80 transition-colors text-xs tracking-wider typewriter"
                    >
                        CLEAR FILTERS
                    </button>
                </div>
                
                <!-- Recipe list -->
                <div class="flex-grow overflow-y-auto min-h-0 border border-zinc-700/40 bg-zinc-800/20">
                    {#if recipes.length === 0}
                        <div class="p-3 text-center text-silver-500/80 italic text-sm">
                            No recipes found. Try creating one!
                        </div>
                    {:else if filteredRecipes.length === 0}
                        <div class="p-3 text-center text-silver-500/80 italic text-sm">
                            No recipes match your search. Try different filters.
                        </div>
                    {:else}
                        <ul class="divide-y divide-zinc-700/30">
                            {#each filteredRecipes as recipe}
                                <li>
                                    <button 
                                        onclick={() => selectRecipe(recipe)}
                                        class="w-full text-left p-2 hover:bg-zinc-700/30 hover:text-brass-light/80 transition-colors {selectedRecipe === recipe ? 'bg-zinc-700/30 text-brass-light/80' : ''}"
                                    >
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
            
            <!-- Right column: Recipe details or creation form -->
            <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col h-full overflow-hidden">
                {#if selectedRecipe}
                    <!-- Recipe details -->
                    <div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 h-full flex flex-col relative">
                        <!-- Logo background -->
                        <div class="absolute inset-x-0 top-8 bottom-8 bg-contain bg-center bg-no-repeat opacity-[0.01] pointer-events-none" style="background-image: url('/images/logo.png'); filter: sepia(100%) hue-rotate(10deg) saturate(400%);"></div>
                        
                        <div class="flex justify-between items-start mb-3 border-b border-zinc-700/40 pb-2 relative z-10">
                            <h3 class="text-lg text-brass-light/90 font-display tracking-wider">{selectedRecipe.name}</h3>
                            
                            <div class="flex items-center">
                                {#if isAdmin}
                                    <button 
                                        class="text-red-400/80 hover:text-red-400 transition-colors text-sm"
                                        onclick={() => {
                                            if (confirm(`Are you sure you want to delete "${selectedRecipe.name}"?`)) {
                                                deleteRecipe(selectedRecipe.id);
                                                selectedRecipe = null;
                                                setTimeout(() => {
                                                    getAllRecipes().then(data => {
                                                        recipes = data;
                                                        filteredRecipes = [...recipes];
                                                    });
                                                }, 1000);
                                            }
                                        }}
                                        title="Delete Recipe"
                                    >
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                {/if}
                                <button 
                                    class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-xs ml-2"
                                    onclick={clearSelectedRecipe}
                                    title="Close Recipe"
                                >
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="flex-grow overflow-y-auto">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div>
                                    <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Category</h4>
                                    <p class="text-white/90 text-base">{selectedRecipe.category}</p>
                                </div>
                                
                                <div>
                                    <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Required Job</h4>
                                    <p class="text-white/90 text-base">{selectedRecipe.job || 'None'}</p>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div>
                                    <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Amount Produced</h4>
                                    <p class="text-white/90 text-base">{selectedRecipe.amount} {selectedRecipe.amount > 1 ? 'items' : 'item'}</p>
                                </div>
                                
                                <div>
                                    <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-1 font-semibold">Experience</h4>
                                    <p class="text-white/90 text-base">
                                        {#if selectedRecipe.experience > 0}
                                            +{selectedRecipe.experience} XP
                                        {:else if selectedRecipe.experience === 0}
                                            No XP
                                        {:else}
                                            N/A
                                        {/if}
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="text-brass-mid/90 text-sm uppercase tracking-wider mb-2 border-b border-zinc-700/50 pb-1 font-semibold">Components Required</h4>
                                
                                {#if selectedRecipe.components && selectedRecipe.components.length > 0}
                                    <ul class="space-y-1.5 mt-2">
                                        {#each selectedRecipe.components as component}
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
                        </div>
                    </div>
                {:else}
                    <!-- Recipe creation form -->
                    <div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 flex flex-col h-full relative">
                        <!-- Logo background -->
                        <div class="absolute inset-x-0 top-8 bottom-8 bg-contain bg-center bg-no-repeat opacity-[0.01] pointer-events-none" style="background-image: url('/images/logo.png'); filter: sepia(100%) hue-rotate(10deg) saturate(400%);"></div>
                        
                        <h3 class="text-lg text-brass-light/90 font-display tracking-wider mb-3 border-b border-zinc-700/40 pb-2 relative z-10">Create New Recipe</h3>
                        
                        <div class="flex flex-col flex-grow overflow-hidden relative z-10">
                            <form class="flex flex-col h-full" onsubmit={(e) => { e.preventDefault(); submitNewRecipe(); }}>
                                <!-- Top section with form fields - fixed height -->
                                <div class="flex-shrink-0">
                                    <!-- Recipe name -->
                                    <div class="mb-2">
                                        <label for="recipeName" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Recipe Name</label>
                                        <input 
                                            type="text" 
                                            id="recipeName" 
                                            value={newRecipeName}
                                            oninput={(e) => newRecipeName = e.target.value}
                                            class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                                            placeholder="Enter recipe name"
                                            required
                                        />
                                    </div>
                                    
                                    <!-- Amount and Experience -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                        <div>
                                            <label for="recipeAmount" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Amount</label>
                                            <input 
                                                type="number" 
                                                id="recipeAmount" 
                                                value={newRecipeAmount}
                                                oninput={(e) => newRecipeAmount = parseInt(e.target.value) || 1}
                                                min="1"
                                                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label for="recipeExperience" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Experience</label>
                                            <input 
                                                type="number" 
                                                id="recipeExperience" 
                                                value={newRecipeExperience}
                                                oninput={(e) => newRecipeExperience = parseInt(e.target.value || '0')}
                                                min="-1"
                                                class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                                            />
                                        </div>
                                    </div>
                                    
                                    <!-- Category and Job -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label for="recipeCategory" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Category</label>
                                            <div class="relative">
                                                <select 
                                                    id="recipeCategory" 
                                                    value={newRecipeCategory}
                                                    onchange={(e) => newRecipeCategory = e.target.value}
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
                                            <label for="recipeJob" class="block text-brass-mid/90 text-xs uppercase tracking-wider mb-1 font-semibold">Required Job</label>
                                            <div class="relative">
                                                <select 
                                                    id="recipeJob" 
                                                    value={newRecipeJob}
                                                    onchange={(e) => newRecipeJob = e.target.value}
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
                                
                                <!-- Components section - grows and scrolls -->
                                <div class="flex flex-col flex-grow min-h-0 overflow-hidden">
                                    <!-- Components header - fixed height -->
                                    <div class="flex-shrink-0 flex justify-between items-center mb-1">
                                        <label class="text-brass-mid/90 text-xs uppercase tracking-wider font-semibold">Components</label>
                                        <button 
                                            type="button"
                                            onclick={addComponent}
                                            class="text-xs px-2 py-0.5 bg-zinc-700/60 text-brass-light/90 hover:bg-zinc-700/80 transition-colors"
                                        >
                                            + ADD
                                        </button>
                                    </div>
                                    
                                    <!-- Component list - scrollable -->
                                    <div class="overflow-y-auto flex-grow min-h-0 space-y-2">
                                        {#each newRecipeComponents as component, index}
                                            <div class="flex items-center space-x-2 p-1.5 border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-700/20 transition-colors">
                                                <input 
                                                    type="text"
                                                    value={component.name}
                                                    oninput={(e) => {
                                                        const updated = [...newRecipeComponents];
                                                        updated[index].name = e.target.value;
                                                        newRecipeComponents = updated;
                                                    }}
                                                    placeholder="Component name"
                                                    class="flex-grow bg-zinc-800/40 border border-zinc-700/50 p-1 text-white/90 focus:outline-none focus:border-brass-mid/70 typewriter text-xs"
                                                />
                                                
                                                <input 
                                                    type="number" 
                                                    value={component.amount}
                                                    oninput={(e) => {
                                                        const updated = [...newRecipeComponents];
                                                        updated[index].amount = parseInt(e.target.value) || 1;
                                                        newRecipeComponents = updated;
                                                    }}
                                                    min="1"
                                                    class="w-16 bg-zinc-800/40 border border-zinc-700/50 p-1 text-brass-light/90 focus:outline-none focus:border-brass-mid/70 typewriter text-xs"
                                                    placeholder="Qty"
                                                />
                                                
                                                <button 
                                                    type="button"
                                                    onclick={() => removeComponent(index)}
                                                    class="text-silver-500/80 hover:text-silver-300/90 transition-colors"
                                                    title="Remove component"
                                                >
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                                
                                <!-- Bottom section with button - fixed height -->
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
                            </form>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>
