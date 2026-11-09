<script lang="ts">
  import BellIcon from '@lucide/svelte/icons/bell';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Popover from '#lib/shared/ui/popover/index.js';
  import { invitationInbox } from '../../stores/invitation-inbox.svelte.js';
  import ReceivedInvitationItem from '../received-invitation-item/received-invitation-item.svelte';

  let open = $state(false);
  const count = $derived(invitationInbox.items.length);

  const label = $derived(count ? `Obvestila, novih: ${count}` : 'Obvestila');
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="relative" aria-label={label}>
        <BellIcon class="size-[18px]" />
        {#if count}
          <span
            class="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground ring-2 ring-background"
          >
            {count}
          </span>
        {/if}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content
    align="end"
    sideOffset={8}
    class="w-[min(22rem,calc(100vw-2rem))] gap-0 rounded-xl p-0 shadow-[0_16px_40px_-16px_rgb(11_21_48/0.25)]"
  >
    <div class="flex items-center justify-between border-b px-4 py-3">
      <p class="text-sm font-medium">Obvestila</p>
      {#if count}
        <span class="text-xs text-muted-foreground">Povabila: {count}</span>
      {/if}
    </div>
    {#if count}
      <div class="flex max-h-96 flex-col gap-1 overflow-y-auto p-1.5">
        {#each invitationInbox.items as invitation (invitation.id)}
          <ReceivedInvitationItem {invitation} onResponded={() => (open = false)} />
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center gap-1 px-4 py-8 text-center">
        <p class="text-sm font-medium">Ni novih obvestil</p>
        <p class="text-xs text-muted-foreground">
          Ko te nekdo povabi v gospodinjstvo, se povabilo pojavi tukaj.
        </p>
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>
