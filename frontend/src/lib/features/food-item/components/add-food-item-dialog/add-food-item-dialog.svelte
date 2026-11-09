<script lang="ts">
  import * as Dialog from '#lib/shared/ui/dialog/index.js';
  import type { FoodCategory, FoodItem } from '../../types/food-item.js';
  import AddFoodItemForm from '../add-food-item-form/add-food-item-form.svelte';

  let {
    open = $bindable(false),
    householdId,
    initialCategory = null,
    oncreated,
  }: {
    open?: boolean;
    householdId: string;
    initialCategory?: FoodCategory | null;
    oncreated?: (item: FoodItem) => void;
  } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Dodaj živilo</Dialog.Title>
      <Dialog.Description>Živilo vidijo vsi člani gospodinjstva.</Dialog.Description>
    </Dialog.Header>
    {#if open}
      <AddFoodItemForm
        {householdId}
        {initialCategory}
        oncancel={() => (open = false)}
        oncreated={(item) => {
          open = false;
          oncreated?.(item);
        }}
      />
    {/if}
  </Dialog.Content>
</Dialog.Root>
