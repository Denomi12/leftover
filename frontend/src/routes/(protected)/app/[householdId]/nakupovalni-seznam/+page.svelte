<script lang="ts">
  import { AppHeader } from '#lib/features/app-shell/index.js';
  import { ShoppingList } from '#lib/features/shopping-item/index.js';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toBuyCount = $derived(data.items.filter((item) => !item.completed).length);
</script>

<svelte:head>
  <title>Nakupovalni seznam · {data.household.name} · Leftover</title>
</svelte:head>

<AppHeader
  title="Nakupovalni seznam"
  description={`${data.household.name} · za nakup: ${toBuyCount}`}
/>

<ShoppingList items={data.items} householdId={data.household.id} />
