// Define types for crafting system
export interface CraftingComponent {
    name: string;
    amount: number;
}

export interface CraftingRecipe {
    id: string;
    name: string;
    amount: number;
    components: CraftingComponent[];
    experience: number;
    category: string;
    job: string;
}

// Import recipes from constants
import { useRest } from './useRest';
import { API_ROUTES, CRAFTING_CATEGORIES } from './useConstants';

const { addQuery, doQuery } = useRest();

export const useCrafting = () => {
    // Store for crafting recipes - initialize with recipes from constants
    let recipes: CraftingRecipe[] = [];
    
    // Function to get all recipes
    const getAllRecipes = async (): Promise<CraftingRecipe[]> => {
        const data = await doQuery(API_ROUTES.getCraftingRecipes, {});
        if (!data) return [];

        // we want to sort them by category in the order of CRAFTING_CATEGORIES
        data.sort((a: CraftingRecipe, b: CraftingRecipe) => {
            const aIndex = Object.values(CRAFTING_CATEGORIES).indexOf(a.category);
            const bIndex = Object.values(CRAFTING_CATEGORIES).indexOf(b.category);
            return aIndex - bIndex;
        });
        
        recipes = data;
        return recipes;
    };
    
    // Function to get recipes by category
    const getRecipesByCategory = (category: string): CraftingRecipe[] => {
        return recipes.filter(recipe => recipe.category === category);
    };
    
    // Function to get recipes by job
    const getRecipesByJob = (job: string): CraftingRecipe[] => {
        return recipes.filter(recipe => recipe.job === job);
    };
    
    // Function to get all available categories that have recipes
    const getAvailableCategories = (): string[] => {
        const categories = new Set<string>();
        recipes.forEach(recipe => categories.add(recipe.category));
        return Array.from(categories).sort();
    };
    
    // Function to get all available jobs that have recipes
    const getAvailableJobs = (): string[] => {
        const jobs = new Set<string>();
        recipes.forEach(recipe => jobs.add(recipe.job));
        return Array.from(jobs).sort();
    };
    
    // Function to search recipes by name
    const searchRecipes = (query: string, recipes: CraftingRecipe[]): CraftingRecipe[] => {
        if (!query) return recipes;
        
        const searchTerm = query.toLowerCase();
        return recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.components.some(comp => comp.name.toLowerCase().includes(searchTerm))
        );
    };
    
    // Function to get recipes that can be made with given components
    const getRecipesByAvailableComponents = (availableComponents: CraftingComponent[]): CraftingRecipe[] => {
        return recipes.filter(recipe => {
            return recipe.components.every(required => {
                const available = availableComponents.find(c => c.name === required.name);
                return available && available.amount >= required.amount;
            });
        });
    };
    
    // Function to get recipes that use a specific component
    const getRecipesByComponent = (componentName: string): CraftingRecipe[] => {
        return recipes.filter(recipe => 
            recipe.components.some(comp => comp.name === componentName)
        );
    };
    
    // Function to create a new recipe
    const createRecipe = async (recipeData: any) => {
        // Validate the recipe
        if (!recipeData.name || !recipeData.amount || !recipeData.category || !recipeData.job || recipeData.experience === null || !recipeData.components || !recipeData.components.length) {
            console.error('Invalid recipe data:', recipeData);
            return;
        }

        recipeData.components = JSON.stringify(recipeData.components);
        addQuery(API_ROUTES.createCraftingRecipe, recipeData, () => {});
    };

    const updateRecipe = async (recipeData: any) => {
        // Validate the recipe
        if (!recipeData.name || !recipeData.amount || !recipeData.category || !recipeData.job || recipeData.experience === null || !recipeData.components || !recipeData.components.length) {
            console.error('Invalid recipe data:', recipeData);
            return;
        }

        const inputData = {
            id: recipeData.id,
            name: recipeData.name,
            amount: recipeData.amount,
            experience: recipeData.experience,
            category: recipeData.category,
            job: recipeData.job,
            components: JSON.stringify(recipeData.components)
        }

        addQuery(API_ROUTES.updateCraftingRecipe, inputData, () => {});
    };

    // Function to delete a recipe
    const deleteRecipe = async (recipeId: string) => {
      addQuery(API_ROUTES.deleteCraftingRecipe, { id: recipeId }, () => {});
    };
    
    // Return the functions as an object
    return {
        getAllRecipes,
        getRecipesByCategory,
        getRecipesByJob,
        getAvailableCategories,
        getAvailableJobs,
        searchRecipes,
        getRecipesByAvailableComponents,
        getRecipesByComponent,
        createRecipe,
        updateRecipe,
        deleteRecipe
    };
};