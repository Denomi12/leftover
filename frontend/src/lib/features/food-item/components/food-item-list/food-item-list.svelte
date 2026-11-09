<script lang="ts">
  import ArchiveIcon from '@lucide/svelte/icons/archive';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import PencilIcon from '@lucide/svelte/icons/pencil';
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Card from '#lib/shared/ui/card/index.js';
  import * as Empty from '#lib/shared/ui/empty/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { formatExpiration } from '../../lib/expiration.js';
  import { FOOD_CATEGORIES } from '../../lib/food-categories.js';
  import {
    formatGroupQuantity,
    groupExpirationStatus,
    type FoodGroup,
  } from '../../lib/food-groups.js';
  import { formatBatchCount, formatQuantity } from '../../lib/food-units.js';
  import type { FoodItem } from '../../types/food-item.js';
  import ExpirationBadge from '../expiration-badge/expiration-badge.svelte';

  let {
    groups,
    selectedKey,
    canEdit,
    onselect,
    onedit,
    ondelete,
  }: {
    groups: FoodGroup[];
    selectedKey: string | null;
    canEdit: boolean;
    onselect: (group: FoodGroup) => void;
    onedit: (item: FoodItem) => void;
    ondelete: (item: FoodItem) => void;
  } = $props();
</script>

<Card.Root class="gap-4">
  <Card.Header>
    <Card.Title class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      Vsa živila · {groups.length}
    </Card.Title>
  </Card.Header>

  <Card.Content class="px-0">
    {#if groups.length === 0}
      <Empty.Root class="mx-(--card-spacing) border border-dashed py-8">
        <Empty.Header>
          <Empty.Media variant="icon" class="bg-secondary text-primary">
            <ArchiveIcon />
          </Empty.Media>
          <Empty.Title class="text-base">V hladilniku še ni živil</Empty.Title>
          <Empty.Description>
            Dodana živila se prikažejo tukaj in na svojem mestu v hladilniku.
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    {:else}
      <div data-food-list class="max-h-[26rem] overflow-y-auto scrollbar-soft">
        <ul class="flex flex-col gap-1.5 px-(--card-spacing) py-1">
          {#each groups as group (group.key)}
            {@const meta = FOOD_CATEGORIES[group.category]}
            {@const selected = group.key === selectedKey}
            {@const batches = group.items.length}
            {@const first = group.items[0]}
            {@const expandable = canEdit || batches > 1}
            <li
              data-food-row={group.key}
              class={cn(
                'rounded-xl border bg-card transition-[border-color,background-color,box-shadow,translate] duration-200 hover:-translate-y-px hover:border-primary/40 hover:shadow-[0_10px_20px_-16px_rgb(37_99_235/0.6)]',
                selected && 'border-primary bg-secondary/60 ring-1 ring-primary',
              )}
            >
              <button
                type="button"
                aria-pressed={selected}
                aria-expanded={expandable ? selected : undefined}
                onclick={() => onselect(group)}
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary [&_svg]:size-4"
                >
                  <meta.icon />
                </span>
                <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span class="truncate text-sm font-medium">{group.name}</span>
                  <span class="truncate text-xs text-muted-foreground">
                    {meta.label} · {formatGroupQuantity(group.items)}
                    {#if batches > 1}
                      · {formatBatchCount(batches)}
                    {:else if first.expirationDate}
                      · rok {formatExpiration(first.expirationDate)}
                    {/if}
                  </span>
                </span>
                <ExpirationBadge status={groupExpirationStatus(group)} />
                {#if expandable}
                  <ChevronDownIcon
                    class={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      selected && 'rotate-180',
                    )}
                  />
                {/if}
              </button>

              {#if selected && expandable}
                <ul class="mx-3 mb-2 flex flex-col border-t pt-1">
                  {#each group.items as item (item.id)}
                    <li class="relative flex min-h-9 items-center gap-3 py-0.5 pl-12 text-xs">
                      <ExpirationBadge
                        status={item.expirationStatus}
                        marker
                        class="absolute left-5"
                      />
                      <span class="font-medium tabular-nums">
                        {formatQuantity(item.quantity, item.unit)}
                      </span>
                      <span class="flex-1 text-muted-foreground tabular-nums">
                        {item.expirationDate
                          ? `rok ${formatExpiration(item.expirationDate)}`
                          : 'brez roka'}
                      </span>
                      {#if canEdit}
                        <span class="flex shrink-0 items-center">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Uredi ${item.name}`}
                            title="Uredi"
                            onclick={() => onedit(item)}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Odstrani ${item.name}`}
                            title="Odstrani"
                            class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onclick={() => ondelete(item)}
                          >
                            <Trash2Icon />
                          </Button>
                        </span>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
