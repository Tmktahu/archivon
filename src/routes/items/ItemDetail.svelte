<script lang="ts">
  import { onMount } from 'svelte';
  import { EventBus, Events } from '$lib/eventbus';
  import { useItems } from '$lib/models/useItems';
  import type { Item } from '$lib/models/useItems';

  export let isAdmin: boolean = false;

  let item: Item | null = null;
  let isEditing = false;

  const { updateItem, deleteItem, createItem } = useItems();

  onMount(() => {
    EventBus.on(Events.SELECT_ITEM, (selectedItem) => {
      item = selectedItem as Item;
      isEditing = false;
    });
  });

  function startEditing() {
    isEditing = true;
  }

  function cancelEditing() {
    isEditing = false;
  }

  async function saveEditedItem() {
    if (!item) return;
    await updateItem(item);
    isEditing = false;
    EventBus.emit(Events.UPDATE_ITEM_LIST);
  }

  async function deleteSelectedItem() {
    if (!item) return;
    await deleteItem(item.id);
    item = null;
    EventBus.emit(Events.UPDATE_ITEM_LIST);
  }

  // New item creation
  let newItem: Item = { id: '', name: '', npcPrice: 0 };

  async function saveNewItem() {
    if (!newItem.name || newItem.npcPrice === null || newItem.npcPrice === undefined) return;
    await createItem(newItem);
    newItem = { id: '', name: '', npcPrice: 0 };
    EventBus.emit(Events.UPDATE_ITEM_LIST);
  }
</script>

{#if item}
  <div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 h-full flex flex-col relative">
    <div class="flex justify-between items-start mb-3 border-b border-zinc-700/40 pb-2">
      <h3 class="text-lg text-brass-light/90 font-display tracking-wider">{item.name}</h3>
      <div class="flex items-center gap-2">
        {#if isAdmin}
          <button class="text-red-400/80 hover:text-red-400 transition-colors text-sm" on:click={deleteSelectedItem} title="Delete Item">☠</button>
        {/if}
        <button class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-sm" on:click={startEditing} title="Edit Item">✎</button>
        <button class="text-silver-500/80 hover:text-silver-300/90 transition-colors text-base" on:click={() => (item = null)} title="Close">⨯</button>
      </div>
    </div>

    {#if isEditing}
      <div class="flex flex-col gap-3">
        <div>
          <label for="item-name-input" class="block text-xs mb-1">Name</label>
          <input id="item-name-input" bind:value={item.name} class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90" />
        </div>
        <div>
          <label for="item-price-input" class="block text-xs mb-1">NPC Price</label>
          <input id="item-price-input" type="number" bind:value={item.npcPrice} class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90" />
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button on:click={saveEditedItem} class="px-3 py-1 bg-zinc-700/50 hover:bg-zinc-700/70">Save</button>
          <button on:click={cancelEditing} class="px-3 py-1 bg-zinc-700/50 hover:bg-zinc-700/70">Cancel</button>
        </div>
      </div>
    {:else}
      <div class="flex flex-col gap-3">
        <div>
          <span class="block text-xs mb-1">Name</span>
          <div class="text-white/90">{item.name}</div>
        </div>
        <div>
          <span class="block text-xs mb-1">NPC Price</span>
          <div class="text-white/90">${item.npcPrice}</div>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="border-2 border-double border-zinc-700/50 bg-zinc-800/20 p-3 h-full flex flex-col relative">
    <h3 class="text-lg text-brass-light/90 font-display tracking-wider mb-3">Create New Item</h3>
    <div class="flex flex-col gap-3">
      <div>
        <label for="new-item-name-input" class="block text-xs mb-1">Name</label>
        <input id="new-item-name-input" bind:value={newItem.name} class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90" />
      </div>
      <div>
        <label for="new-item-price-input" class="block text-xs mb-1">NPC Price</label>
        <input id="new-item-price-input" type="number" bind:value={newItem.npcPrice} class="w-full bg-zinc-800/40 border border-zinc-700/50 p-1.5 text-white/90" />
      </div>
      <div class="flex justify-end mt-2">
        <button on:click={saveNewItem} class="px-3 py-1 bg-zinc-700/50 hover:bg-zinc-700/70">Create</button>
      </div>
    </div>
  </div>
{/if}
