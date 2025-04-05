import axios from 'axios';
import { API_ROUTES } from '$lib/models/useConstants';

const ROUTES: { [key: string]: { route: Function; method: string } } = {
  [API_ROUTES.getCraftingRecipes]: { method: 'GET', route: () => API_ROUTES.getCraftingRecipes },
  [API_ROUTES.getCraftingRecipe]: { method: 'GET', route: (params: any) => API_ROUTES.getCraftingRecipe.replace(':id', params.id) },
  [API_ROUTES.createCraftingRecipe]: { method: 'POST', route: () => API_ROUTES.createCraftingRecipe },
  [API_ROUTES.deleteCraftingRecipe]: { method: 'DELETE', route: (params: any) => API_ROUTES.deleteCraftingRecipe.replace(':id', params.id) },
};

const queryQueue: {
  apiRoute: string;
  params: any;
  finishedCallback: Function;
}[] = [];

export const useRest = () => {
  const setup = () => {
    setInterval(() => {
      if (queryQueue.length > 0) {
        const query = queryQueue.shift();
        if (!query) return;
        const data = doQuery(query.apiRoute, query.params);
        query.finishedCallback(data);
      }
    }, 100);
  };

  const addQuery = (apiRoute: any, params: any, finishedCallback: any) => {
    queryQueue.push({ apiRoute, params, finishedCallback });
  };

  const doQuery = async (apiRoute: string, params: any) => {
    try {
      const route = ROUTES[apiRoute] ? ROUTES[apiRoute].route(params) : apiRoute;
      let response = null;
      
      // Get API domain from environment variables with a fallback
      const apiDomain = import.meta.env.VITE_API_DOMAIN || '';

      if (ROUTES[apiRoute].method === 'GET') {
        // console.log('GET', apiRoute, apiDomain + route, params);
        response = await axios.get(apiDomain + route, {
          params,
          timeout: 0, // Disable timeout on the client side
          headers: {
            'Content-Type': 'application/json',
            // Connection: 'keep-alive', // Ensure connection is kept alive
          },
        });
      } else if (ROUTES[apiRoute].method === 'POST') {
        // console.log('POST', apiRoute, apiDomain + route);
        response = await axios.post(apiDomain + route, params, {
          timeout: 0, // Disable timeout on the client side
          headers: {
            'Content-Type': 'application/json',
            // Connection: 'keep-alive', // Ensure connection is kept alive
          },
        });
      } else if (ROUTES[apiRoute].method === 'PUT') {
        // console.log('PUT', apiRoute, apiDomain + route);
        response = await axios.put(apiDomain + route, params, {
          timeout: 0, // Disable timeout on the client side
          headers: {
            'Content-Type': 'application/json',
            // Connection: 'keep-alive', // Ensure connection is kept alive
          },
        });
      } else if (ROUTES[apiRoute].method === 'DELETE') {
        // console.log('DELETE', apiRoute, apiDomain + route);
        response = await axios.delete(apiDomain + route, {
          timeout: 0, // Disable timeout on the client side
          headers: {
            'Content-Type': 'application/json',
            // Connection: 'keep-alive', // Ensure connection is kept alive
          },
        });
      }

      const data = response?.data;

      if (data.error) {
        return null;
      } else {
        return data;
      }
    } catch (error) {
      // console.error(error);
      return null;
    }
  };

  return {
    setup,
    addQuery,
    doQuery,
  };
};
