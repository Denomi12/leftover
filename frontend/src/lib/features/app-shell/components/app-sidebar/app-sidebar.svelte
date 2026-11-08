<script lang="ts">
  import { page } from '$app/state';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import { logout } from '#lib/features/auth/index.js';
  import {
    type Household,
    HouseholdSwitcher,
    householdPath,
  } from '#lib/features/household/index.js';
  import { Logo } from '#lib/shared/components/logo/index.js';
  import * as Sidebar from '#lib/shared/ui/sidebar/index.js';
  import { NAV_ITEMS } from '../../constants/navigation.js';

  let { households, activeHouseholdId }: { households: Household[]; activeHouseholdId?: string } =
    $props();

  const hrefFor = (path: string | undefined) =>
    activeHouseholdId !== undefined && path !== undefined
      ? householdPath(activeHouseholdId, path)
      : undefined;

  const itemClass =
    'text-sidebar-foreground/80 hover:bg-transparent hover:text-foreground active:bg-transparent data-active:bg-transparent data-active:font-medium data-active:text-primary data-active:hover:text-primary';
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Header>
    <div
      class="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center"
    >
      <a href="/app" aria-label="Leftover, domov" class="pl-1 group-data-[collapsible=icon]:hidden">
        <Logo />
      </a>
      <Sidebar.Trigger class="text-muted-foreground" />
    </div>
    <HouseholdSwitcher {households} activeId={activeHouseholdId} />
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel class="text-[13px] font-medium text-muted-foreground">
        Meni
      </Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each NAV_ITEMS as item (item.label)}
            {@const href = hrefFor(item.path)}
            <Sidebar.MenuItem>
              {#if href}
                <Sidebar.MenuButton
                  isActive={page.url.pathname === href}
                  tooltipContent={item.label}
                  class={itemClass}
                >
                  {#snippet child({ props })}
                    <a {href} {...props}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              {:else}
                <Sidebar.MenuButton
                  aria-disabled="true"
                  tabindex={-1}
                  tooltipContent={item.label}
                  title={item.path === undefined
                    ? 'Kmalu na voljo'
                    : 'Najprej ustvari gospodinjstvo'}
                  class={itemClass}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </Sidebar.MenuButton>
              {/if}
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton
          size="lg"
          tooltipContent="Odjava"
          class={`${itemClass} h-10 text-[15px] [&_svg]:size-[18px]`}
          onclick={logout}
        >
          <LogOutIcon />
          <span>Odjava</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
