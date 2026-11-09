<script lang="ts">
  import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Badge } from '#lib/shared/ui/badge/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { formatDay, formatMealCount, groupMealsByDay } from '../../lib/meal-plan.js';
  import type { PlannedMeal } from '../../types/planned-meal.js';
  import MealCard from '../meal-card/meal-card.svelte';

  let { meals, canEdit, onadd }: { meals: PlannedMeal[]; canEdit: boolean; onadd: () => void } =
    $props();

  const days = $derived(groupMealsByDay(meals));
</script>

{#if days.length === 0}
  <Empty.Root class="border border-dashed bg-card py-16">
    <Empty.Header>
      <Empty.Media variant="icon" class="bg-secondary text-primary">
        <CalendarDaysIcon />
      </Empty.Media>
      <Empty.Title>Načrt obrokov je prazen</Empty.Title>
      <Empty.Description>
        Načrtuj obrok za izbrani dan in takoj vidiš, katere sestavine imaš doma.
      </Empty.Description>
    </Empty.Header>
    {#if canEdit}
      <Empty.Content>
        <Button onclick={onadd}>
          <PlusIcon data-icon="inline-start" />
          Nov obrok
        </Button>
      </Empty.Content>
    {/if}
  </Empty.Root>
{:else}
  <div class="flex flex-col gap-8">
    {#each days as day (day.date)}
      {@const label = formatDay(day.date)}
      <section
        class={cn('grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)]', label.past && 'opacity-60')}
        aria-label={`${label.weekday}, ${label.dayMonth}`}
      >
        <header class="flex items-baseline gap-2 lg:flex-col lg:gap-1 lg:pt-4">
          <h2 class="font-display text-xl tracking-[-0.02em]">{label.weekday}</h2>
          <p class="flex items-center gap-2 text-sm text-muted-foreground">
            {label.dayMonth}
            {#if label.relative}
              <Badge>{label.relative}</Badge>
            {/if}
          </p>
          <p class="text-xs text-muted-foreground max-lg:ml-auto">
            {formatMealCount(day.meals.length)}
          </p>
        </header>
        <div class="grid items-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {#each day.meals as meal (meal.id)}
            <MealCard {meal} />
          {/each}
        </div>
      </section>
    {/each}
  </div>
{/if}
