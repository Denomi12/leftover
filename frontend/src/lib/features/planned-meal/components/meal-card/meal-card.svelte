<script lang="ts">
  import ChefHatIcon from '@lucide/svelte/icons/chef-hat';
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import { formatQuantity } from '#lib/features/food-item/index.js';
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { formatIngredientCount } from '../../lib/meal-plan.js';
  import type { PlannedMeal } from '../../types/planned-meal.js';

  let {
    meal,
    canEdit,
    oncomplete,
  }: { meal: PlannedMeal; canEdit: boolean; oncomplete: (meal: PlannedMeal) => void } = $props();

  const missing = $derived(meal.ingredients.filter((item) => item.stockStatus === 'MISSING'));
</script>

<Card.Root
  class={cn(
    'gap-4 transition-[translate,box-shadow] duration-200',
    meal.completed
      ? 'bg-muted/40 shadow-none'
      : 'hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-20px_rgb(37_99_235/0.6)]',
  )}
>
  <Card.Header class="gap-2.5">
    <Card.Title
      class={cn(
        'font-display text-lg font-normal tracking-[-0.02em]',
        meal.completed && 'text-muted-foreground',
      )}
    >
      {meal.name}
    </Card.Title>
    {#if meal.completed}
      <Badge variant="outline">
        <ChefHatIcon data-icon="inline-start" />
        Pripravljeno
      </Badge>
    {:else if missing.length === 0}
      <Badge variant="secondary" class="text-primary">
        <CircleCheckIcon data-icon="inline-start" />
        Vse sestavine so doma
      </Badge>
    {:else}
      <Badge class="bg-brand-dark text-white">
        <CircleAlertIcon data-icon="inline-start" />
        {#if missing.length === 1}
          Manjka: {missing[0].name}
          {formatQuantity(missing[0].missingQuantity, missing[0].unit)}
        {:else}
          Manjka {formatIngredientCount(missing.length)}
        {/if}
      </Badge>
    {/if}
  </Card.Header>

  <Card.Content>
    <ul class="flex flex-col gap-2.5 text-sm">
      {#each meal.ingredients as ingredient (ingredient.id)}
        {@const isMissing = !meal.completed && ingredient.stockStatus === 'MISSING'}
        <li class="flex items-start gap-3">
          <span
            class={cn(
              'mt-1.5 size-2.5 shrink-0 rounded-full',
              meal.completed
                ? 'bg-muted-foreground/40'
                : isMissing
                  ? 'border-2 border-brand-dark'
                  : 'bg-primary',
            )}
          ></span>
          <span class="flex min-w-0 flex-1 flex-col">
            <span class={cn('truncate font-medium', meal.completed && 'text-muted-foreground')}>
              {ingredient.name}
            </span>
            {#if !meal.completed}
              <span class={cn('text-xs', isMissing ? 'text-brand-dark' : 'text-muted-foreground')}>
                {isMissing
                  ? `Manjka ${formatQuantity(ingredient.missingQuantity, ingredient.unit)}`
                  : 'Na zalogi'}
              </span>
            {/if}
          </span>
          <span class="shrink-0 text-muted-foreground tabular-nums">
            {formatQuantity(ingredient.quantity, ingredient.unit)}
          </span>
        </li>
      {/each}
    </ul>
  </Card.Content>

  {#if canEdit && !meal.completed}
    <Card.Footer>
      <Button variant="outline" class="w-full" onclick={() => oncomplete(meal)}>
        <ChefHatIcon data-icon="inline-start" />
        Označi kot pripravljeno
      </Button>
    </Card.Footer>
  {/if}
</Card.Root>
