// Define types for crafting system
export interface CraftingComponent {
    name: string;
    amount: number;
}

export interface CraftingRecipe {
    name: string;
    amount: number;
    components: CraftingComponent[];
    experience: number;
    category: string;
    job: string;
}

// Import recipes from constants
import { AVAILABLE_RECIPES } from './useConstants';
import { useRest } from './useRest';
import { API_ROUTES } from './useConstants';

const { addQuery } = useRest();

export const useCrafting = () => {
    // Store for crafting recipes - initialize with recipes from constants
    const recipes: CraftingRecipe[] = [...AVAILABLE_RECIPES];
    
    // Function to add a new recipe
    const addRecipe = (recipe: CraftingRecipe) => {
        recipes.push(recipe);
        // Note: This only adds to the in-memory array
        // To persist, you would manually update the constants file
    };
    
    // Function to get all recipes
    const getAllRecipes = (): CraftingRecipe[] => {
        return [...recipes];
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
    const searchRecipes = (query: string): CraftingRecipe[] => {
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
        // the components needs to be json stringified
        recipeData.components = JSON.stringify(recipeData.components);
        console.log('Creating recipe:', recipeData);

      addQuery(API_ROUTES.createCraftingRecipe, recipeData, () => {});
    };

    // Function to delete a recipe
    const deleteRecipe = async (recipeId: string) => {
      addQuery(API_ROUTES.deleteCraftingRecipe, { id: recipeId }, () => {});
    };
    
    // Return the functions as an object
    return {
        addRecipe,
        getAllRecipes,
        getRecipesByCategory,
        getRecipesByJob,
        getAvailableCategories,
        getAvailableJobs,
        searchRecipes,
        getRecipesByAvailableComponents,
        getRecipesByComponent,
        createRecipe,
        deleteRecipe
    };
};