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
    requiredJob: string;
}

// Import recipes from constants
import { AVAILABLE_RECIPES } from './useConstants';

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
        return recipes.filter(recipe => recipe.requiredJob === job);
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
        recipes.forEach(recipe => jobs.add(recipe.requiredJob));
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
    
    // Function to check if player can craft a recipe
    const canCraft = (recipeName: string, playerComponents: CraftingComponent[], playerJob: string): boolean => {
        const recipe = recipes.find(r => r.name === recipeName);
        
        if (!recipe) return false;
        
        // Check if player has the required job
        if (recipe.requiredJob !== playerJob && recipe.requiredJob !== CRAFTING_JOBS.NONE) return false;
        
        // Check if player has all required components
        return recipe.components.every(required => {
            const playerComponent = playerComponents.find(pc => pc.name === required.name);
            return playerComponent && playerComponent.amount >= required.amount;
        });
    };
    
    // Function to craft an item
    const craftItem = (recipeName: string, playerComponents: CraftingComponent[]): { 
        success: boolean; 
        newComponents?: CraftingComponent[]; 
        experienceGained?: number;
    } => {
        const recipe = recipes.find(r => r.name === recipeName);
        
        if (!recipe) return { success: false };
        
        // Check if player has all required components
        const canMake = recipe.components.every(required => {
            const playerComponent = playerComponents.find(pc => pc.name === required.name);
            return playerComponent && playerComponent.amount >= required.amount;
        });
        
        if (!canMake) return { success: false };
        
        // Update player components
        const updatedComponents = [...playerComponents];
        
        // Remove required components
        recipe.components.forEach(required => {
            const index = updatedComponents.findIndex(pc => pc.name === required.name);
            if (index !== -1) {
                updatedComponents[index] = {
                    ...updatedComponents[index],
                    amount: updatedComponents[index].amount - required.amount
                };
            }
        });
        
        // Add crafted item to player components
        const craftedItemIndex = updatedComponents.findIndex(pc => pc.name === recipe.name);
        if (craftedItemIndex !== -1) {
            updatedComponents[craftedItemIndex] = {
                ...updatedComponents[craftedItemIndex],
                amount: updatedComponents[craftedItemIndex].amount + recipe.amount
            };
        } else {
            updatedComponents.push({
                name: recipe.name,
                amount: recipe.amount
            });
        }
        
        return {
            success: true,
            newComponents: updatedComponents,
            experienceGained: recipe.experience
        };
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
        canCraft,
        craftItem
    };
};