<script lang="ts">
  import { goto } from '$app/navigation';
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import HouseIcon from '@lucide/svelte/icons/house';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import * as DropdownMenu from '#lib/shared/ui/dropdown-menu/index.js';
  import * as Sidebar from '#lib/shared/ui/sidebar/index.js';
  import { householdSummary } from '../../lib/household-labels.js';
  import { householdPath } from '../../lib/household-routes.js';
  import type { Household } from '../../types/household.js';
  import CreateHouseholdDialog from '../create-household-dialog/create-household-dialog.svelte';

  let { households, activeId }: { households: Household[]; activeId?: string } = $props();

  const sidebar = Sidebar.useSidebar();
  const active = $derived(households.find((household) => household.id === activeId));

  let createOpen = $state(false);

  async function select(household: Household) {
    sidebar.setOpenMobile(false);
    await goto(householdPath(household.id));
  }

  function openCreate() {
    sidebar.setOpenMobile(false);
    createOpen = true;
  }
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            {...props}
            size="lg"
            class="h-auto gap-3 rounded-lg border border-sidebar-border px-2.5 py-2 group-data-[collapsible=icon]:border-0 hover:bg-sidebar-accent/60 data-[state=open]:bg-sidebar-accent/60"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
            >
              <HouseIcon class="size-4" />
            </span>
            <span class="flex min-w-0 flex-1 flex-col leading-tight">
              {#if active}
                <span class="truncate text-sm font-medium text-foreground">{active.name}</span>
                <span class="truncate text-xs text-muted-foreground">
                  {householdSummary(active.role, active.memberCount)}
                </span>
              {:else}
                <span class="truncate text-sm font-medium text-foreground">Gospodinjstvo</span>
                <span class="truncate text-xs text-muted-foreground">Izberi ali ustvari</span>
              {/if}
            </span>
            <ChevronsUpDownIcon class="ml-auto size-4 text-muted-foreground" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="start"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        sideOffset={8}
        class="w-72 rounded-xl p-1.5 shadow-[0_16px_40px_-16px_rgb(11_21_48/0.25)] ring-border"
      >
        {#if households.length}
          <DropdownMenu.Label class="px-2 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">
            Tvoja gospodinjstva
          </DropdownMenu.Label>
          {#each households as household (household.id)}
            <DropdownMenu.Item
              class="gap-3 rounded-lg px-2 py-2"
              onSelect={() => select(household)}
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
              >
                <HouseIcon class="size-4" />
              </span>
              <span class="flex min-w-0 flex-1 flex-col leading-tight">
                <span class="truncate text-sm font-medium">{household.name}</span>
                <span class="truncate text-xs text-muted-foreground">
                  {householdSummary(household.role, household.memberCount)}
                </span>
              </span>
              {#if household.id === activeId}
                <CheckIcon class="size-4 text-primary" />
              {/if}
            </DropdownMenu.Item>
          {/each}
          <DropdownMenu.Separator class="mx-1 my-1" />
        {/if}
        <DropdownMenu.Item class="gap-3 rounded-lg px-2 py-2" onSelect={openCreate}>
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-md border border-dashed text-muted-foreground"
          >
            <PlusIcon class="size-4" />
          </span>
          <span class="text-sm">Novo gospodinjstvo</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>

<CreateHouseholdDialog bind:open={createOpen} />
