<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import HouseIcon from '@lucide/svelte/icons/house';
  import { toast } from 'svelte-sonner';
  import { HOUSEHOLDS_DEPENDENCY, householdPath } from '#lib/features/household/index.js';
  import { Button } from '#lib/shared/ui/button/index.js';
  import * as Item from '#lib/shared/ui/item/index.js';
  import { Spinner } from '#lib/shared/ui/spinner/index.js';
  import { cn } from '#lib/shared/utils.js';
  import { householdInvitationApi } from '../../api/household-invitation.api.js';
  import { mapInvitationResponseError } from '../../api/household-invitation-errors.js';
  import { formatSentAt, roleAsLabel } from '../../lib/invitation-labels.js';
  import { invitationInbox } from '../../stores/invitation-inbox.svelte.js';
  import type { ReceivedInvitation } from '../../types/household-invitation.js';

  let {
    invitation,
    variant = 'default',
    class: className,
    onResponded,
  }: {
    invitation: ReceivedInvitation;
    variant?: 'default' | 'outline';
    class?: string;
    onResponded?: () => void;
  } = $props();

  let pendingAction = $state<'accept' | 'decline' | null>(null);
  const busy = $derived(pendingAction !== null);

  async function accept() {
    pendingAction = 'accept';
    try {
      const household = await householdInvitationApi.accept(invitation.id);
      invitationInbox.remove(invitation.id);
      await invalidate(HOUSEHOLDS_DEPENDENCY);
      onResponded?.();
      toast.success(`Zdaj si v gospodinjstvu ${household.name}.`);
      await goto(householdPath(household.id));
    } catch (error) {
      toast.error(mapInvitationResponseError(error));
      void invitationInbox.refresh();
    } finally {
      pendingAction = null;
    }
  }

  async function decline() {
    pendingAction = 'decline';
    try {
      await householdInvitationApi.decline(invitation.id);
      invitationInbox.remove(invitation.id);
      onResponded?.();
      toast(`Povabilo v gospodinjstvo ${invitation.household.name} je zavrnjeno.`);
    } catch (error) {
      toast.error(mapInvitationResponseError(error));
      void invitationInbox.refresh();
    } finally {
      pendingAction = null;
    }
  }
</script>

<Item.Root {variant} size="sm" class={cn('items-start gap-3', className)}>
  <Item.Media class="size-9 rounded-lg bg-secondary text-primary">
    <HouseIcon class="size-4" />
  </Item.Media>
  <Item.Content class="min-w-0 gap-1">
    <Item.Title class="block leading-snug font-normal text-muted-foreground">
      <span class="font-medium text-foreground">{invitation.invitedBy.name}</span>
      te vabi v
      <span class="font-medium text-foreground">{invitation.household.name}</span>
    </Item.Title>
    <Item.Description class="text-xs">
      {roleAsLabel(invitation.role)} · {formatSentAt(invitation.createdAt)}
    </Item.Description>
    <div class="mt-2 flex gap-2">
      <Button size="sm" disabled={busy} onclick={accept}>
        {#if pendingAction === 'accept'}
          <Spinner data-icon="inline-start" />
        {/if}
        Sprejmi
      </Button>
      <Button size="sm" variant="outline" disabled={busy} onclick={decline}>
        {#if pendingAction === 'decline'}
          <Spinner data-icon="inline-start" />
        {/if}
        Zavrni
      </Button>
    </div>
  </Item.Content>
</Item.Root>
