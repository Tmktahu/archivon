import mitt from 'mitt';
export const EventBus = mitt();

export const Events = {
  SELECT_RECIPE: 'selectRecipe',
  RECIPE_UPDATED: 'recipeUpdated',
  CLEAR_SELECTED_RECIPE: 'clearSelectedRecipe',
};
