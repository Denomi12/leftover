<script lang="ts">
  import { tick } from 'svelte';
  import { expiringFoodItems } from '../../lib/expiration.js';
  import { foodGroupKey, groupFoodItems, type FoodGroup } from '../../lib/food-groups.js';
  import { scrollWithin } from '../../lib/scroll-within.js';
  import type { FoodCategory, FoodItem } from '../../types/food-item.js';
  import ExpiringFoodCard from '../expiring-food-card/expiring-food-card.svelte';
  import DeleteFoodItemDialog from '../delete-food-item-dialog/delete-food-item-dialog.svelte';
  import FoodItemDialog from '../food-item-dialog/food-item-dialog.svelte';
  import FoodItemList from '../food-item-list/food-item-list.svelte';
  import Fridge from '../fridge/fridge.svelte';

  let {
    householdId,
    items,
    canEdit,
    selectedKey = $bindable<string | null>(null),
    onadd,
  }: {
    householdId: string;
    items: FoodItem[];
    canEdit: boolean;
    selectedKey?: string | null;
    onadd: (category: FoodCategory | null) => void;
  } = $props();

  let editOpen = $state(false);
  let deleteOpen = $state(false);
  let activeItem = $state<FoodItem | null>(null);

  const groups = $derived(groupFoodItems(items));
  const expiring = $derived(expiringFoodItems(items));

  const groupsByCategory = $derived.by(() => {
    const byCategory = new Map<FoodCategory, FoodGroup[]>();
    for (const group of groups) {
      const list = byCategory.get(group.category);
      if (list) list.push(group);
      else byCategory.set(group.category, [group]);
    }
    return byCategory;
  });

  function openEdit(item: FoodItem) {
    activeItem = item;
    editOpen = true;
  }

  function openDelete(item: FoodItem) {
    activeItem = item;
    deleteOpen = true;
  }

  function selectItem(item: FoodItem) {
    const group = groups.find(({ key }) => key === foodGroupKey(item));
    if (group) select(group, 'list');
  }

  async function select(group: FoodGroup, source: 'fridge' | 'list') {
    selectedKey = selectedKey === group.key ? null : group.key;
    if (!selectedKey) return;

    await tick();
    const selector = CSS.escape(group.key);
    if (source === 'fridge') {
      scrollWithin(
        document.querySelector(`[data-food-row="${selector}"]`),
        '[data-food-list]',
        'y',
      );
    } else {
      scrollWithin(
        document.querySelector(`[data-food-item="${selector}"]`),
        '[data-fridge-row]',
        'x',
      );
    }
  }
</script>

<div
  class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]"
>
  <Fridge
    {groupsByCategory}
    {selectedKey}
    {canEdit}
    onselect={(group) => select(group, 'fridge')}
    onadd={(category) => onadd(category)}
  />

  <div class="flex min-w-0 flex-col gap-6 xl:sticky xl:top-6">
    <FoodItemList
      {groups}
      {selectedKey}
      {canEdit}
      onselect={(group) => select(group, 'list')}
      onedit={openEdit}
      ondelete={openDelete}
    />
    <ExpiringFoodCard items={expiring} {selectedKey} onselect={selectItem} />
  </div>
</div>

{#if canEdit}
  <FoodItemDialog
    bind:open={editOpen}
    {householdId}
    item={activeItem}
    onsaved={(saved) => (selectedKey = foodGroupKey(saved))}
  />
  <DeleteFoodItemDialog bind:open={deleteOpen} {householdId} item={activeItem} />
{/if}
