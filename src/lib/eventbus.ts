import mitt from 'mitt';
export const EventBus = mitt();

export const Events = {
  SELECT_RECIPE: 'selectRecipe',
  RECIPE_UPDATED: 'recipeUpdated',
  CLEAR_SELECTED_RECIPE: 'clearSelectedRecipe',
  UPDATE_RECIPE_LIST: 'updateRecipeList',

  SELECT_ITEM: 'selectItem',
  UPDATE_ITEM_LIST: 'updateItemList',
};
