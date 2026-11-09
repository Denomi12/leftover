<script lang="ts">
  import { tick } from 'svelte';
  import { scrollWithin } from '../../lib/scroll-within.js';
  import type { FoodCategory, FoodItem } from '../../types/food-item.js';
  import FoodItemList from '../food-item-list/food-item-list.svelte';
  import Fridge from '../fridge/fridge.svelte';

  let {
    items,
    canEdit,
    selectedId = $bindable<string | null>(null),
    onadd,
  }: {
    items: FoodItem[];
    canEdit: boolean;
    selectedId?: string | null;
    onadd: (category: FoodCategory | null) => void;
  } = $props();

  const itemsByCategory = $derived.by(() => {
    const groups = new Map<FoodCategory, FoodItem[]>();
    for (const item of items) {
      const group = groups.get(item.category);
      if (group) group.push(item);
      else groups.set(item.category, [item]);
    }
    return groups;
  });

  async function select(item: FoodItem, source: 'fridge' | 'list') {
    selectedId = selectedId === item.id ? null : item.id;
    if (!selectedId) return;

    await tick();
    if (source === 'fridge') {
      scrollWithin(document.querySelector(`[data-food-row="${item.id}"]`), '[data-food-list]', 'y');
    } else {
      scrollWithin(
        document.querySelector(`[data-food-item="${item.id}"]`),
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
    {itemsByCategory}
    {selectedId}
    {canEdit}
    onselectitem={(item) => select(item, 'fridge')}
    onadd={(category) => onadd(category)}
  />

  <div class="min-w-0 xl:sticky xl:top-6">
    <FoodItemList {items} {selectedId} onselect={(item) => select(item, 'list')} />
  </div>
</div>
