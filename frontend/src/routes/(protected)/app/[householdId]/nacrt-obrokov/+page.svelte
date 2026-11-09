<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import {
    formatMealCount,
    MealPlan,
    PlannedMealDialog,
  } from '#lib/features/planned-meal/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let addOpen = $state(false);

  const canEdit = $derived(data.household.role !== 'GUEST');
  const description = $derived(
    canEdit
      ? `${data.household.name} · ${formatMealCount(data.meals.length)}`
      : `${data.household.name} · kot gost načrt lahko samo pregleduješ`,
  );
</script>

<svelte:head>
  <title>Načrt obrokov · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader title="Načrt obrokov" {description}>
  {#snippet actions()}
    {#if canEdit}
      <Button
        onclick={() => (addOpen = true)}
        class="max-sm:size-9 max-sm:p-0"
        aria-label="Nov obrok"
      >
        <PlusIcon data-icon="inline-start" class="max-sm:m-0" />
        <span class="max-sm:sr-only">Nov obrok</span>
      </Button>
    {/if}
  {/snippet}
</AppHeader>

<MealPlan
  meals={data.meals}
  householdId={data.household.id}
  {canEdit}
  onadd={() => (addOpen = true)}
/>

{#if canEdit}
  <PlannedMealDialog bind:open={addOpen} householdId={data.household.id} />
{/if}
