<script lang="ts">
  import { tick } from 'svelte';
  import { groupFoodItems, type FoodGroup } from '../../lib/food-groups.js';
  import { scrollWithin } from '../../lib/scroll-within.js';
  import type { FoodCategory, FoodItem } from '../../types/food-item.js';
  import FoodItemList from '../food-item-list/food-item-list.svelte';
  import Fridge from '../fridge/fridge.svelte';

  let {
    items,
    canEdit,
    selectedKey = $bindable<string | null>(null),
    onadd,
  }: {
    items: FoodItem[];
    canEdit: boolean;
    selectedKey?: string | null;
    onadd: (category: FoodCategory | null) => void;
  } = $props();

  const groups = $derived(groupFoodItems(items));

  const groupsByCategory = $derived.by(() => {
    const byCategory = new Map<FoodCategory, FoodGroup[]>();
    for (const group of groups) {
      const list = byCategory.get(group.category);
      if (list) list.push(group);
      else byCategory.set(group.category, [group]);
    }
    return byCategory;
  });

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

  <div class="min-w-0 xl:sticky xl:top-6">
    <FoodItemList {groups} {selectedKey} onselect={(group) => select(group, 'list')} />
  </div>
</div>
