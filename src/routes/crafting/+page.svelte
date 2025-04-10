<script lang="ts">
    import { onMount } from 'svelte';
    import RecipeList from './RecipeList.svelte';
    import { useCrafting } from '$lib/models/useCrafting';
    import type { CraftingRecipe } from '$lib/models/useCrafting';
    import { CRAFTING_CATEGORIES, CRAFTING_JOBS } from '$lib/models/useConstants';
    import RecipeDetail from './RecipeDetail.svelte';
    import RecipeCreateForm from './RecipeCreateForm.svelte';
    import { EventBus, Events } from '$lib/eventbus';

    // Get crafting functions
    const {
        getAllRecipes,
        getRecipesByCategory,
        searchRecipes,
        createRecipe,
        deleteRecipe,
        updateRecipe
    } = useCrafting();

    let isAdmin = $state(false);

    let recipes = $state<CraftingRecipe[]>([]);
    let filteredRecipes = $state<CraftingRecipe[]>([]);

    onMount(() => {
        // @ts-ignore
        window.makeAdmin = () => {
            isAdmin = true;
        };
    });
    
    // Initialize state variables
    let searchQuery = $state('');
    let selectedCategory = $state('');
    
    // Create new recipe form state
    let newRecipeName = $state('');
    let newRecipeAmount = $state(1);
    let newRecipeCategory = $state(CRAFTING_CATEGORIES.BASIC);
    let newRecipeJob = $state(CRAFTING_JOBS.NONE);
    let newRecipeExperience = $state(0);
    let newRecipeComponents = $state([{ name: '', amount: 1 }]);

    // Edit mode state
    
    // Single effect block for filtering recipes
    $effect(() => {
        (async () => {
            filteredRecipes = await getAllRecipes();
            recipes = filteredRecipes;
        })();
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
    const removeComponent = (index: number) => {
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
            <RecipeList
                {recipes}
                {filteredRecipes}
                bind:searchQuery
                bind:selectedCategory
                on:clearFilters={clearFilters}
                on:doSearch={doSearch}
            />
            
            <!-- Right column: Recipe details or creation form -->
            <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col h-full overflow-hidden">
                <RecipeDetail
                    isAdmin={isAdmin}
                    on:recipeUpdated={() => {
                        getAllRecipes().then(data => {
                            recipes = data;
                            filteredRecipes = [...recipes];
                        });
                    }}
                    on:deleteRecipe={(e) => deleteRecipe(e.detail)}
                />
            </div>
        </div>
    </div>
</main>
