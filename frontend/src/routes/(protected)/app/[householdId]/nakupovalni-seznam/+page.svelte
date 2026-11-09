<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { ShoppingItemDialog, ShoppingList } from '#lib/features/shopping-item/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let addOpen = $state(false);

  const canEdit = $derived(data.household.role !== 'GUEST');
  const toBuyCount = $derived(data.items.filter((item) => !item.completed).length);
</script>

<svelte:head>
  <title>Nakupovalni seznam · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader
  title="Nakupovalni seznam"
  description={`${data.household.name} · za nakup: ${toBuyCount}`}
>
  {#snippet actions()}
    {#if canEdit}
      <Button
        onclick={() => (addOpen = true)}
        class="max-sm:size-9 max-sm:p-0"
        aria-label="Dodaj postavko"
      >
        <PlusIcon data-icon="inline-start" class="max-sm:m-0" />
        <span class="max-sm:sr-only">Dodaj postavko</span>
      </Button>
    {/if}
  {/snippet}
</AppHeader>

<ShoppingList
  items={data.items}
  householdId={data.household.id}
  {canEdit}
  onadd={() => (addOpen = true)}
/>

{#if canEdit}
  <ShoppingItemDialog bind:open={addOpen} householdId={data.household.id} />
{/if}
