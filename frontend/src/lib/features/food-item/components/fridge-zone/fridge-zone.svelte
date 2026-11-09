<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { cn } from '#lib/shared/utils.js';
  import { FOOD_CATEGORIES } from '../../lib/food-categories.js';
  import type { FoodGroup } from '../../lib/food-groups.js';
  import type { FoodCategory } from '../../types/food-item.js';
  import FridgeItem from '../fridge-item/fridge-item.svelte';

  let {
    category,
    groups,
    variant = 'shelf',
    selectedKey,
    canEdit,
    onselect,
    onadd,
    class: className,
  }: {
    category: FoodCategory;
    groups: FoodGroup[];
    variant?: 'shelf' | 'drawer' | 'door';
    selectedKey: string | null;
    canEdit: boolean;
    onselect: (group: FoodGroup) => void;
    onadd: (category: FoodCategory) => void;
    class?: string;
  } = $props();

  const meta = $derived(FOOD_CATEGORIES[category]);
</script>

<div
  role="group"
  aria-label={meta.label}
  class={cn(
    'flex min-w-0 flex-col gap-1 rounded-2xl border bg-card/80 p-2 shadow-[inset_0_-10px_20px_-18px_rgb(30_58_138/0.35)]',
    variant === 'drawer' && 'pb-3',
    className,
  )}
>
  <span
    class="flex h-7 w-fit max-w-full items-center gap-1.5 rounded-full bg-card px-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground shadow-[0_1px_2px_rgb(11_21_48/0.06)] ring-1 ring-border [&_svg]:size-3.5 [&_svg]:shrink-0"
  >
    <meta.icon />
    <span class="truncate">{meta.label}</span>
    {#if groups.length > 0}
      <span class="text-muted-foreground/70 tabular-nums">· {groups.length}</span>
    {/if}
  </span>

  <div
    data-fridge-row
    class={cn(
      'relative flex min-h-[6.75rem] items-end gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-soft',
      variant === 'door' && 'flex-wrap justify-center overflow-x-visible',
    )}
  >
    {#each groups as group (group.key)}
      <FridgeItem {group} selected={group.key === selectedKey} {onselect} />
    {:else}
      {#if canEdit}
        <button
          type="button"
          aria-label={`Dodaj živilo v ${meta.label}`}
          onclick={() => onadd(category)}
          class="group/add flex w-[4.75rem] shrink-0 flex-col items-center gap-2 rounded-xl pt-2 text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span
            class="flex size-16 items-center justify-center rounded-xl border border-dashed border-border bg-transparent transition-[border-color,color,translate] duration-200 group-hover/add:-translate-y-0.5 group-hover/add:border-primary/60 group-hover/add:text-primary"
          >
            <PlusIcon class="size-4" />
          </span>
          <span class="text-xs">Dodaj</span>
        </button>
      {:else}
        <span class="self-center px-1 py-6 text-xs text-muted-foreground/70">Prazno</span>
      {/if}
    {/each}
  </div>

  {#if variant === 'door'}
    <span
      aria-hidden="true"
      class="mx-1 h-1.5 rounded-full bg-[color-mix(in_oklab,var(--primary)_20%,var(--card))]"
    ></span>
  {/if}
</div>
