<script lang="ts">
  import { page } from '$app/state';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import { logout } from '#lib/features/auth/index.js';
  import { Logo } from '#lib/shared/components/logo/index.js';
  import * as Sidebar from '#lib/shared/ui/sidebar/index.js';
  import { NAV_ITEMS } from '../../constants/navigation.js';

  const itemClass =
    'text-sidebar-foreground/80 hover:bg-transparent hover:text-foreground active:bg-transparent data-active:bg-transparent data-active:font-medium data-active:text-primary data-active:hover:text-primary';
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Header>
    <div
      class="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center"
    >
      <a
        href="/app"
        aria-label="Leftover, zaloga"
        class="pl-1 group-data-[collapsible=icon]:hidden"
      >
        <Logo />
      </a>
      <Sidebar.Trigger class="text-muted-foreground" />
    </div>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel class="text-[13px] font-medium text-muted-foreground">
        Meni
      </Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each NAV_ITEMS as item (item.label)}
            <Sidebar.MenuItem>
              {#if item.href}
                <Sidebar.MenuButton
                  isActive={page.url.pathname === item.href}
                  tooltipContent={item.label}
                  class={itemClass}
                >
                  {#snippet child({ props })}
                    <a href={item.href} {...props}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              {:else}
                <Sidebar.MenuButton
                  aria-disabled="true"
                  tabindex={-1}
                  tooltipContent={`${item.label} (kmalu)`}
                  title="Kmalu na voljo"
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
