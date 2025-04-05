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
        recipes = await getAllRecipes();
        filteredRecipes = [...recipes];
        // Apply filters
        if (searchQuery && selectedCategory) {
            // Filter by both search query and category
            filteredRecipes = searchRecipes(searchQuery).filter(recipe => recipe.category === selectedCategory);
        } else if (searchQuery) {
            // Filter by search query only
            filteredRecipes = searchRecipes(searchQuery);
        } else if (selectedCategory) {
            // Filter by category only
            filteredRecipes = getRecipesByCategory(selectedCategory);
        } else {
            // No filters, show all recipes
            filteredRecipes = [...recipes];
        }
    });
    
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
        newRecipeExperience = 10;
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
    /* Custom styling for select dropdown */
    .select-custom {
        color-scheme: dark;
    }
    
    /* This targets Webkit browsers (Chrome, Safari, newer Edge) */
    .select-custom option {
        background-color: rgb(39, 39, 42); /* zinc-800 */
        color: rgb(212, 212, 216, 0.9); /* silver-300/90 */
    }
    
    /* This targets Firefox */
    @-moz-document url-prefix() {
        .select-custom {
            background-color: rgb(39, 39, 42); /* zinc-800 */
            color: rgb(212, 212, 216, 0.9); /* silver-300/90 */
        }
    }
    
    /* Microsoft Edge and IE */
    _:-ms-lang(x), .select-custom option {
        background-color: rgb(39, 39, 42) !important; /* zinc-800 */
        color: rgb(212, 212, 216, 0.9) !important; /* silver-300/90 */
    }
    
    /* Fix for recipe list scrolling */
    .recipe-list-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden; /* Prevent container from scrolling */
    }
    
    .recipe-list {
        overflow-y: auto; /* Only the list should scroll */
        flex-grow: 1;
        padding-right: 8px;
    }
    
    /* Make sure the page doesn't scroll */
    :global(body) {
        overflow: hidden;
    }
</style>

<main class="h-screen flex flex-col bg-zinc-900 text-silver-400 relative overflow-hidden">
    <!-- Background with subtle warm tone -->
    <div class="absolute inset-0 bg-zinc-900 opacity-90 z-0"></div>
    
    <div class="container mx-auto px-4 py-4 relative z-10 flex flex-col flex-grow overflow-hidden">
        <!-- Crafting Section -->
        <section class="flex flex-col flex-grow max-w-5xl mx-auto relative overflow-hidden">
            <div class="border-4 border-double border-zinc-700/50 rounded-none shadow-xl overflow-hidden wanted-poster-container relative z-10 bg-zinc-800/30 flex flex-col flex-grow">
                <div class="p-4 border-b-2 border-zinc-700/40 flex-shrink-0">
                    <h2 class="text-2xl font-bold text-center font-display tracking-wider text-silver-400/90 drop-shadow-sm western-text">CRAFTING RECIPES</h2>
                    <div class="flex justify-center items-center mt-2">
                        <div class="h-px w-12 bg-gradient-to-r from-transparent to-silver-500/40"></div>
                        <div class="occult-symbol-outer opacity-15 mx-4"></div>
                        <div class="h-px w-12 bg-gradient-to-l from-transparent to-silver-500/40"></div>
                    </div>
                </div>
                
                <div class="crafting-container p-4 bg-transparent flex flex-col flex-grow overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden">
                        <!-- Sidebar with filters -->
                        <div class="md:col-span-1 border-r border-zinc-700/20 pr-4 flex flex-col overflow-hidden">
                            <div class="mb-4 flex-shrink-0">
                                <label for="search" class="block text-silver-300/90 mb-2 font-semibold uppercase text-sm tracking-wider">Search Recipes</label>
                                <input 
                                    type="text" 
                                    id="search" 
                                    placeholder="Search..." 
                                    value={searchQuery}
                                    oninput={(e) => searchQuery = e.target.value}
                                    class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter"
                                />
                            </div>
                            
                            <div class="mb-4 flex-shrink-0">
                                <label for="category" class="block text-silver-300/90 mb-2 font-semibold uppercase text-sm tracking-wider">Category</label>
                                <div class="relative">
                                    <select 
                                        id="category" 
                                        value={selectedCategory}
                                        onchange={(e) => selectedCategory = e.target.value}
                                        class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom"
                                    >
                                        <option value="">All Categories</option>
                                        {#each Object.values(CRAFTING_CATEGORIES) as category}
                                            <option value={category}>{category}</option>
                                        {/each}
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg class="w-4 h-4 text-silver-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                class="western-button w-full py-2 px-4 text-brass-light/90 text-sm tracking-wider mb-4 flex-shrink-0"
                                onclick={clearFilters}
                            >
                                CLEAR FILTERS
                            </button>
                            
                            <div class="recipe-list-container">
                                <h3 class="text-silver-300/90 mb-3 font-semibold uppercase text-sm tracking-wider border-b border-zinc-700/30 pb-2 flex-shrink-0">Recipe List</h3>
                                
                                <div class="recipe-list">
                                    {#if !filteredRecipes || filteredRecipes.length === 0}
                                        <p class="text-silver-500/80 italic text-center py-4">No recipes found matching your criteria.</p>
                                    {:else}
                                        <div class="space-y-2">
                                            {#each filteredRecipes as recipe}
                                                {#if recipe}
                                                    <button 
                                                        class="recipe-item w-full text-left p-3 border border-zinc-700/30 bg-zinc-800/30 hover:bg-zinc-700/40 transition-colors flex justify-between items-center {selectedRecipe === recipe ? 'selected border-l-4 border-l-brass-mid/70' : ''}"
                                                        onclick={() => selectRecipe(recipe)}
                                                    >
                                                        <span class="text-silver-300/90 typewriter">{recipe.name || 'Unnamed Recipe'}</span>
                                                        <span class="text-xs px-2 py-1 bg-zinc-700/40 text-brass-light/80 rounded">{recipe.category || 'Uncategorized'}</span>
                                                    </button>
                                                {/if}
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Recipe details -->
                        <div class="md:col-span-2 pl-4 flex flex-col overflow-hidden">
                            {#if selectedRecipe}
                                <div class="border-2 border-double border-zinc-700/40 bg-zinc-800/20 p-4 flex flex-col overflow-auto h-full">
                                    <div class="flex justify-between items-center mb-4 border-b border-zinc-700/30 pb-3 flex-shrink-0">
                                        <h3 class="text-xl text-brass-light/90 font-display tracking-wider">{selectedRecipe.name || 'Unnamed Recipe'}</h3>
                                        <div class="flex items-center">
                                            {#if isAdmin}
                                                <button 
                                                    class="text-red-400/80 hover:text-red-300/90 transition-colors mr-3"
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
                                                    title="Delete recipe"
                                                >
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            {/if}
                                            <button 
                                                class="text-silver-500/80 hover:text-silver-300/90 transition-colors"
                                                onclick={clearSelectedRecipe}
                                            >
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                        <div>
                                            <div class="mb-4">
                                                <span class="text-silver-500/80 text-sm uppercase tracking-wider">Category:</span>
                                                <span class="ml-2 text-silver-300/90 typewriter">{selectedRecipe.category || 'Uncategorized'}</span>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <span class="text-silver-500/80 text-sm uppercase tracking-wider">Required Job:</span>
                                                <span class="ml-2 text-silver-300/90 typewriter">{selectedRecipe.job || 'None'}</span>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <span class="text-silver-500/80 text-sm uppercase tracking-wider">Produces:</span>
                                                <span class="ml-2 text-silver-300/90 typewriter">{selectedRecipe.amount || 1} × {selectedRecipe.name || 'Unnamed Recipe'}</span>
                                            </div>
                                            
                                            {#if selectedRecipe.experience}
                                                <div class="mb-4">
                                                    <span class="text-silver-500/80 text-sm uppercase tracking-wider">Experience:</span>
                                                    <span class="ml-2 text-silver-300/90 typewriter">{selectedRecipe.experience} XP</span>
                                                </div>
                                            {/if}
                                        </div>
                                        
                                        <div class="relative">
                                            <!-- Occult symbol background -->
                                            <div class="absolute top-0 right-0 w-24 h-24 opacity-10 sun-geometry"></div>
                                            
                                            <div class="border-l border-zinc-700/30 pl-4 h-full">
                                                <h4 class="text-brass-light/90 mb-3 font-semibold uppercase text-sm tracking-wider">Required Components:</h4>
                                                
                                                {#if selectedRecipe.components && selectedRecipe.components.length > 0}
                                                    <ul class="space-y-2">
                                                        {#each selectedRecipe.components as component}
                                                            {#if component}
                                                                <li class="flex items-center p-2 border-b border-zinc-700/20">
                                                                    <span class="text-silver-500/80 mr-2 typewriter">{component.amount || 1} ×</span>
                                                                    <span class="text-silver-300/90 typewriter">{component.name || 'Unknown Component'}</span>
                                                                </li>
                                                            {/if}
                                                        {/each}
                                                    </ul>
                                                {:else}
                                                    <p class="text-silver-500/80 italic">No components required</p>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <div class="flex flex-col h-full border-2 border-double border-zinc-700/40 bg-zinc-800/20 p-4">
                                    <h3 class="text-xl text-brass-light/90 font-display tracking-wider mb-4 border-b border-zinc-700/30 pb-3">Create New Recipe</h3>
                                    
                                    <div class="overflow-auto flex-grow">
                                        <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); submitNewRecipe(); }}>
                                            <div>
                                                <label for="recipeName" class="block text-silver-500/80 text-sm uppercase tracking-wider mb-1">Recipe Name</label>
                                                <input 
                                                    type="text" 
                                                    id="recipeName" 
                                                    value={newRecipeName}
                                                    oninput={(e) => newRecipeName = e.target.value}
                                                    class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 placeholder-silver-600/50 focus:outline-none focus:border-brass-mid/70 typewriter"
                                                    placeholder="Enter recipe name"
                                                    required
                                                />
                                            </div>
                                            
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label for="recipeAmount" class="block text-silver-500/80 text-sm uppercase tracking-wider mb-1">Amount Produced</label>
                                                    <input 
                                                        type="number" 
                                                        id="recipeAmount" 
                                                        value={newRecipeAmount}
                                                        oninput={(e) => newRecipeAmount = parseInt(e.target.value) || 1}
                                                        min="1"
                                                        class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 focus:outline-none focus:border-brass-mid/70 typewriter"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label for="recipeExperience" class="block text-silver-500/80 text-sm uppercase tracking-wider mb-1">Experience Points</label>
                                                    <input 
                                                        type="number" 
                                                        id="recipeExperience" 
                                                        value={newRecipeExperience}
                                                        oninput={(e) => newRecipeExperience = parseInt(e.target.value || '0')}
                                                        min="-1"
                                                        class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 focus:outline-none focus:border-brass-mid/70 typewriter"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label for="recipeCategory" class="block text-silver-500/80 text-sm uppercase tracking-wider mb-1">Category</label>
                                                    <div class="relative">
                                                        <select 
                                                            id="recipeCategory" 
                                                            value={newRecipeCategory}
                                                            onchange={(e) => newRecipeCategory = e.target.value}
                                                            class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom"
                                                            required
                                                        >
                                                            {#each Object.values(CRAFTING_CATEGORIES) as category}
                                                                <option value={category}>{category}</option>
                                                            {/each}
                                                        </select>
                                                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                            <svg class="w-4 h-4 text-silver-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label for="recipeJob" class="block text-silver-500/80 text-sm uppercase tracking-wider mb-1">Required Job</label>
                                                    <div class="relative">
                                                        <select 
                                                            id="recipeJob" 
                                                            value={newRecipeJob}
                                                            onchange={(e) => newRecipeJob = e.target.value}
                                                            class="w-full bg-zinc-800/40 border-2 border-zinc-700/40 p-2 text-silver-300/90 appearance-none focus:outline-none focus:border-brass-mid/70 typewriter select-custom"
                                                        >
                                                            {#each Object.values(CRAFTING_JOBS) as job}
                                                                <option value={job}>{job}</option>
                                                            {/each}
                                                        </select>
                                                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                            <svg class="w-4 h-4 text-silver-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div class="flex justify-between items-center mb-2">
                                                    <label class="text-silver-500/80 text-sm uppercase tracking-wider">Components</label>
                                                    <button 
                                                        type="button"
                                                        onclick={addComponent}
                                                        class="text-xs px-2 py-1 bg-zinc-700/60 text-brass-light/80 hover:bg-zinc-700/80 transition-colors"
                                                    >
                                                        + ADD COMPONENT
                                                    </button>
                                                </div>
                                                
                                                <div class="space-y-3 max-h-40 overflow-y-auto p-1">
                                                    {#each newRecipeComponents as component, index}
                                                        <div class="flex items-center space-x-2 p-2 border border-zinc-700/30 bg-zinc-800/30">
                                                            <div class="flex-grow">
                                                                <input 
                                                                    type="text"
                                                                    value={component.name}
                                                                    oninput={(e) => {
                                                                        const updated = [...newRecipeComponents];
                                                                        updated[index].name = e.target.value;
                                                                        newRecipeComponents = updated;
                                                                    }}
                                                                    placeholder="Enter component name"
                                                                    class="w-full bg-zinc-800/40 border border-zinc-700/40 p-1 text-silver-300/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                                                                />
                                                            </div>
                                                            
                                                            <div class="w-20">
                                                                <input 
                                                                    type="number" 
                                                                    value={component.amount}
                                                                    oninput={(e) => {
                                                                        const updated = [...newRecipeComponents];
                                                                        updated[index].amount = parseInt(e.target.value) || 1;
                                                                        newRecipeComponents = updated;
                                                                    }}
                                                                    min="1"
                                                                    class="w-full bg-zinc-800/40 border border-zinc-700/40 p-1 text-silver-300/90 focus:outline-none focus:border-brass-mid/70 typewriter text-sm"
                                                                    placeholder="Qty"
                                                                />
                                                            </div>
                                                            
                                                            <button 
                                                                type="button"
                                                                onclick={() => removeComponent(index)}
                                                                class="text-silver-500/80 hover:text-silver-300/90 transition-colors"
                                                                title="Remove component"
                                                            >
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    {/each}
                                                </div>
                                            </div>
                                            
                                            <div class="flex justify-end pt-4 border-t border-zinc-700/30">
                                                <button 
                                                    type="submit"
                                                    class="western-button py-2 px-6 text-brass-light/90 text-sm tracking-wider"
                                                >
                                                    CREATE RECIPE
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>
