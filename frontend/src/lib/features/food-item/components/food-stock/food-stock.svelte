<script lang="ts">
  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/state';
  import { onDestroy, tick, untrack } from 'svelte';
  import { expiringFoodItems } from '../../lib/expiration.js';
  import { foodGroupKey, groupFoodItems, type FoodGroup } from '../../lib/food-groups.js';
  import { FOOD_ITEM_SEARCH_DEBOUNCE_MS, foodItemUrl } from '../../lib/food-item-query.js';
  import { scrollWithin } from '../../lib/scroll-within.js';
  import type {
    FoodCategory,
    FoodItem,
    FoodItemQuery,
    FoodItemSort,
  } from '../../types/food-item.js';
  import ExpiringFoodCard from '../expiring-food-card/expiring-food-card.svelte';
  import DeleteFoodItemDialog from '../delete-food-item-dialog/delete-food-item-dialog.svelte';
  import FoodItemDialog from '../food-item-dialog/food-item-dialog.svelte';
  import FoodItemList from '../food-item-list/food-item-list.svelte';
  import Fridge from '../fridge/fridge.svelte';

  let {
    householdId,
    items,
    listedItems,
    query,
    canEdit,
    selectedKey = $bindable<string | null>(null),
    onadd,
  }: {
    householdId: string;
    items: FoodItem[];
    listedItems: FoodItem[];
    query: FoodItemQuery;
    canEdit: boolean;
    selectedKey?: string | null;
    onadd: (category: FoodCategory | null) => void;
  } = $props();

  let editOpen = $state(false);
  let deleteOpen = $state(false);
  let activeItem = $state<FoodItem | null>(null);

  let search = $state(untrack(() => query.search));
  let sort = $state(untrack(() => query.sort));
  let sentSearch = untrack(() => query.search);
  let searchTimer: ReturnType<typeof setTimeout> | undefined;

  const groups = $derived(groupFoodItems(items));
  const listedGroups = $derived(groupFoodItems(listedItems));
  const loading = $derived(navigating.to?.url.pathname === page.url.pathname);

  $effect(() => {
    const next = query.search;
    if (next !== sentSearch) {
      sentSearch = next;
      search = next;
    }
  });

  $effect(() => {
    sort = query.sort;
  });

  onDestroy(() => clearTimeout(searchTimer));

  function applyQuery(next: FoodItemQuery) {
    clearTimeout(searchTimer);
    sentSearch = next.search;
    goto(foodItemUrl(page.url, next), { replace: true, reset: false });
  }

  function changeSearch(value: string) {
    search = value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(
      () => applyQuery({ search: value, sort }),
      FOOD_ITEM_SEARCH_DEBOUNCE_MS,
    );
  }

  function changeSort(next: FoodItemSort) {
    sort = next;
    applyQuery({ search, sort: next });
  }
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
      groups={listedGroups}
      totalCount={groups.length}
      {search}
      {sort}
      {loading}
      onsearch={changeSearch}
      onsort={changeSort}
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
