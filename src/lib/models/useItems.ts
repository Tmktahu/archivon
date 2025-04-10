import { useRest } from './useRest';
import { API_ROUTES } from './useConstants';

export interface Item {
  id: string;
  name: string;
  npcPrice: number;
}

const { addQuery, doQuery } = useRest();

export const useItems = () => {
  let items: Item[] = [];

  const getAllItems = async (): Promise<Item[]> => {
    const data = await doQuery(API_ROUTES.getItems, {});
    if (!data) return [];
    items = data;
    return items;
  };

  const createItem = async (itemData: any) => {
    if (!itemData.name || itemData.npcPrice === undefined || itemData.npcPrice === null) {
      console.error('Invalid item data:', itemData);
      return;
    }
    addQuery(API_ROUTES.createItem, itemData, () => {});
  };

  const updateItem = async (itemData: any) => {
    if (!itemData.id || !itemData.name || itemData.npcPrice === undefined || itemData.npcPrice === null) {
      console.error('Invalid item data:', itemData);
      return;
    }
    const inputData = {
      id: itemData.id,
      name: itemData.name,
      npcPrice: itemData.npcPrice,
    };
    addQuery(API_ROUTES.updateItem, inputData, () => {});
  };

  const deleteItem = async (itemId: string) => {
    addQuery(API_ROUTES.deleteItem, { id: itemId }, () => {});
  };

  const getItemsByName = async (names: string[]): Promise<Item[]> => {
    if (!names || names.length === 0) return [];

    const data = await doQuery(API_ROUTES.getItemsByName, { names });
    if (!data) return [];

    return data;
  };

  return {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    getItemsByName,
  };
};
