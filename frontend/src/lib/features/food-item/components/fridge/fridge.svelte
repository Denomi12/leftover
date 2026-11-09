<script lang="ts">
  import { cn } from '#lib/shared/utils.js';
  import { FRIDGE_DOOR, FRIDGE_DRAWER, FRIDGE_SHELVES } from '../../lib/food-categories.js';
  import type { FoodGroup } from '../../lib/food-groups.js';
  import type { FoodCategory } from '../../types/food-item.js';
  import FridgeZone from '../fridge-zone/fridge-zone.svelte';

  let {
    groupsByCategory,
    selectedKey,
    canEdit,
    onselect,
    onadd,
  }: {
    groupsByCategory: Map<FoodCategory, FoodGroup[]>;
    selectedKey: string | null;
    canEdit: boolean;
    onselect: (group: FoodGroup) => void;
    onadd: (category: FoodCategory) => void;
  } = $props();
</script>

<section aria-label="Hladilnik" class="min-w-0">
  <div
    class="rounded-[2rem] border bg-gradient-to-b from-secondary to-secondary/50 p-2.5 shadow-[0_30px_60px_-36px_rgb(11_21_48/0.45)] sm:p-3"
  >
    <div
      class="grid gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_9.5rem] 2xl:grid-cols-[minmax(0,1fr)_11rem]"
    >
      <div
        class="flex min-w-0 flex-col gap-3 rounded-[1.6rem] border bg-gradient-to-b from-card to-card/60 p-2.5 shadow-[inset_0_2px_18px_rgb(37_99_235/0.08)] sm:p-4"
      >
        {#each FRIDGE_SHELVES as shelf, index (index)}
          <div class="flex flex-col gap-1.5">
            <div class={cn('grid gap-2.5', shelf.length === 2 && 'sm:grid-cols-2')}>
              {#each shelf as category (category)}
                <FridgeZone
                  {category}
                  variant="shelf"
                  groups={groupsByCategory.get(category) ?? []}
                  {selectedKey}
                  {canEdit}
                  {onselect}
                  {onadd}
                />
              {/each}
            </div>

            <div
              aria-hidden="true"
              class="h-1.5 rounded-full bg-[color-mix(in_oklab,var(--primary)_20%,var(--card))]"
            ></div>
          </div>
        {/each}

        <div class="flex flex-col gap-1.5">
          <FridgeZone
            category={FRIDGE_DRAWER}
            variant="drawer"
            groups={groupsByCategory.get(FRIDGE_DRAWER) ?? []}
            {selectedKey}
            {canEdit}
            {onselect}
            {onadd}
          />
          <div
            aria-hidden="true"
            class="h-1.5 rounded-full bg-[color-mix(in_oklab,var(--primary)_20%,var(--card))]"
          ></div>
        </div>
      </div>

      <div
        class="grid min-w-0 grid-cols-1 gap-2 rounded-[1.6rem] border bg-gradient-to-b from-card/90 to-card/50 p-2.5 shadow-[inset_0_2px_18px_rgb(37_99_235/0.08)] min-[480px]:grid-cols-3 lg:flex lg:flex-col lg:justify-between lg:gap-4 lg:py-4"
      >
        {#each FRIDGE_DOOR as category (category)}
          <FridgeZone
            {category}
            variant="door"
            groups={groupsByCategory.get(category) ?? []}
            {selectedKey}
            {canEdit}
            {onselect}
            {onadd}
          />
        {/each}
      </div>
    </div>
  </div>
</section>
