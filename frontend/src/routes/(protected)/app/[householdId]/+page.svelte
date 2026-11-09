<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import {
    type FoodCategory,
    FoodItemDialog,
    foodGroupKey,
    groupFoodItems,
    FoodStock,
    formatFoodCount,
  } from '#lib/features/food-item/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let addOpen = $state(false);
  let addCategory = $state<FoodCategory | null>(null);
  let selectedKey = $state<string | null>(null);

  const canEdit = $derived(data.household.role !== 'GUEST');
  const description = $derived(
    canEdit
      ? `${data.household.name} · ${formatFoodCount(groupFoodItems(data.foodItems).length)}`
      : `${data.household.name} · kot gost zalogo lahko samo pregleduješ`,
  );

  function openAdd(category: FoodCategory | null = null) {
    addCategory = category;
    addOpen = true;
  }
</script>

<svelte:head>
  <title>Zaloga · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader title="Moj hladilnik" {description}>
  {#snippet actions()}
    {#if canEdit}
      <Button onclick={() => openAdd()} class="max-sm:size-9 max-sm:p-0" aria-label="Dodaj živilo">
        <PlusIcon data-icon="inline-start" class="max-sm:m-0" />
        <span class="max-sm:sr-only">Dodaj živilo</span>
      </Button>
    {/if}
  {/snippet}
</AppHeader>

<FoodStock
  householdId={data.household.id}
  items={data.foodItems}
  listedItems={data.listedFoodItems}
  query={data.foodQuery}
  {canEdit}
  bind:selectedKey
  onadd={openAdd}
/>

{#if canEdit}
  <FoodItemDialog
    bind:open={addOpen}
    householdId={data.household.id}
    initialCategory={addCategory}
    onsaved={(item) => (selectedKey = foodGroupKey(item))}
  />
{/if}
